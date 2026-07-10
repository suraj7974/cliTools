//! pips — ghost-text package suggestions for `pip install`.
//!
//! Powers inline autosuggestion: as you type `pip install num`, your shell
//! shows `numpy` as dim ghost text (via zsh-autosuggestions). Also usable
//! directly:
//!
//!     pips best num          # -> numpy              (top match, used by the shell hook)
//!     pips list -n 5 num     # -> numpy, numba, ...  (top N)
//!     pips list -r npm expr  # -> express, ...       (npm live search)
//!     pips update            # refresh the cached PyPI package list
//!     pips init zsh          # print the shell hook to add to ~/.zshrc
//!
//! PyPI has no live search API, so we cache a popularity-ranked list of the
//! most-used packages locally (flattened to one name per line for speed).

use std::error::Error;
use std::fs;
use std::io::Read;
use std::path::PathBuf;
use std::time::{Duration, SystemTime};

/// Community-maintained dataset of the most-downloaded PyPI packages,
/// ordered most-popular first. Refreshed regularly upstream.
const PYPI_TOP_URL: &str = "https://hugovk.github.io/top-pypi-packages/top-pypi-packages.min.json";

/// How long a cached list is considered fresh.
const CACHE_MAX_AGE: Duration = Duration::from_secs(7 * 24 * 60 * 60);

type Result<T> = std::result::Result<T, Box<dyn Error>>;

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let cmd = args.first().map(String::as_str).unwrap_or("");

    let res = match cmd {
        "best" => cmd_best(&args[1..]),
        "list" => cmd_list(&args[1..]),
        "install" => cmd_install(&args[1..]),
        "update" => cmd_update(),
        "init" => cmd_init(&args[1..]),
        "" | "-h" | "--help" | "help" => {
            usage();
            return;
        }
        other => {
            eprintln!("unknown command: {other}");
            usage();
            std::process::exit(2);
        }
    };
    if let Err(e) = res {
        eprintln!("error: {e}");
        std::process::exit(1);
    }
}

fn usage() {
    eprint!(
        "pips — ghost-text package suggestions for `pip install`\n\
         \n\
         usage:\n\
         \x20 pips install [-y] <partial> [pip args]  resolve & run `pip install`\n\
         \x20 pips best [-r pypi|npm] <partial>        top match (used by the shell hook)\n\
         \x20 pips list [-r pypi|npm] [-n N] <partial> top N matches\n\
         \x20 pips update                              refresh the cached PyPI list\n\
         \x20 pips init zsh                            print the shell hook for ~/.zshrc\n\
         \n\
         setup:\n\
         \x20 pips update\n\
         \x20 pips init zsh >> ~/.zshrc   # then restart your shell\n"
    );
}

// ---- commands ----

fn cmd_best(args: &[String]) -> Result<()> {
    let q = parse_query(args, 1).ok_or("usage: pips best [-r pypi|npm] <partial>")?;
    let names = suggest(&q.registry, &q.partial, 1)?;
    if let Some(first) = names.first() {
        println!("{first}");
    }
    Ok(())
}

fn cmd_list(args: &[String]) -> Result<()> {
    let q = parse_query(args, 10).ok_or("usage: pips list [-r pypi|npm] [-n N] <partial>")?;
    let names = suggest(&q.registry, &q.partial, q.limit)?;
    for n in names {
        println!("{n}");
    }
    Ok(())
}

/// Resolve a partial to the most-popular matching package, then run
/// `pip install <resolved> [extra pip args]`. Confirms first unless `-y`.
fn cmd_install(args: &[String]) -> Result<()> {
    let (yes, rest) = match args.first().map(String::as_str) {
        Some("-y") | Some("--yes") => (true, &args[1..]),
        _ => (false, args),
    };
    let partial = rest
        .first()
        .ok_or("usage: pips install [-y] <partial> [pip args]")?;
    let extra = &rest[1..];

    let target = match suggest("pypi", partial, 1)?.into_iter().next() {
        // A more-popular package matched the partial — confirm before using it.
        Some(best) if &best != partial => {
            if !yes && !confirm(&format!("Install '{best}' (matched from '{partial}')?"))? {
                eprintln!("aborted");
                return Ok(());
            }
            best
        }
        // Exact/known name, or no suggestion — install exactly what was typed.
        _ => partial.clone(),
    };

    eprintln!("+ pip install {target}");
    run_pip_install(&target, extra)
}

/// Run `pip install`, trying common pip invocations so it works whether the
/// system has `pip`, only `pip3`, or just `python3 -m pip`.
fn run_pip_install(pkg: &str, extra: &[String]) -> Result<()> {
    let candidates: [&[&str]; 3] = [&["pip"], &["pip3"], &["python3", "-m", "pip"]];
    for c in candidates {
        let mut cmd = std::process::Command::new(c[0]);
        cmd.args(&c[1..]).arg("install").arg(pkg).args(extra);
        match cmd.status() {
            Ok(status) if status.success() => return Ok(()),
            Ok(status) => std::process::exit(status.code().unwrap_or(1)),
            // this pip flavor isn't installed — try the next
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => continue,
            Err(e) => return Err(format!("failed to run {}: {e}", c[0]).into()),
        }
    }
    Err("could not find pip (tried pip, pip3, python3 -m pip)".into())
}

/// Prompt on stderr; treat empty / y / yes as yes.
fn confirm(prompt: &str) -> Result<bool> {
    use std::io::Write;
    eprint!("{prompt} [Y/n] ");
    std::io::stderr().flush().ok();
    let mut line = String::new();
    std::io::stdin().read_line(&mut line)?;
    let a = line.trim().to_lowercase();
    Ok(a.is_empty() || a == "y" || a == "yes")
}

fn cmd_update() -> Result<()> {
    let path = cache_path()?;
    build_pypi_cache(&path)?;
    eprintln!("updated PyPI package list -> {}", path.display());
    Ok(())
}

fn cmd_init(args: &[String]) -> Result<()> {
    match args.first().map(String::as_str) {
        Some("zsh") => {
            print!("{ZSH_HOOK}");
            Ok(())
        }
        _ => Err("usage: pips init zsh".into()),
    }
}

// ---- query parsing ----

struct Query {
    registry: String,
    limit: usize,
    partial: String,
}

/// Parse `[-r reg] [-n N] [--] <partial>`. `--` forces the next token to be the
/// positional partial (the shell hook calls `pips best -- "$word"`).
fn parse_query(args: &[String], default_limit: usize) -> Option<Query> {
    let mut registry = String::from("pypi");
    let mut limit = default_limit;
    let mut partial: Option<String> = None;
    let mut positional_only = false;

    let mut i = 0;
    while i < args.len() {
        let a = &args[i];
        if !positional_only {
            match a.as_str() {
                "-r" | "--registry" => {
                    i += 1;
                    registry = args.get(i)?.clone();
                    i += 1;
                    continue;
                }
                "-n" | "--limit" => {
                    i += 1;
                    limit = args.get(i)?.parse().ok()?;
                    i += 1;
                    continue;
                }
                "--" => {
                    positional_only = true;
                    i += 1;
                    continue;
                }
                _ => {}
            }
        }
        if partial.is_none() {
            partial = Some(a.clone());
        }
        i += 1;
    }

    Some(Query {
        registry,
        limit,
        partial: partial?,
    })
}

// ---- suggestion engine ----

fn suggest(registry: &str, partial: &str, limit: usize) -> Result<Vec<String>> {
    match registry {
        "pypi" => {
            let names = load_pypi_names(false)?;
            Ok(rank(&names, partial, limit))
        }
        "npm" => npm_suggest(partial, limit),
        other => Err(format!("unknown registry {other:?} (use pypi or npm)").into()),
    }
}

/// Return up to `limit` names matching `query`: prefix matches first, then
/// substring matches, each preserving the input's popularity ordering.
fn rank(names: &[String], query: &str, limit: usize) -> Vec<String> {
    let q = query.to_lowercase();
    let mut prefix = Vec::new();
    let mut substr = Vec::new();
    for n in names {
        let ln = n.to_lowercase();
        if ln.starts_with(&q) {
            prefix.push(n.clone());
        } else if ln.contains(&q) {
            substr.push(n.clone());
        }
    }
    prefix.extend(substr);
    prefix.truncate(limit);
    prefix
}

// ---- PyPI cache (flat file: one name per line, popularity order) ----

fn load_pypi_names(refresh: bool) -> Result<Vec<String>> {
    let path = cache_path()?;
    if refresh || stale(&path) {
        if let Err(e) = build_pypi_cache(&path) {
            // Fall back to an existing (stale) cache rather than failing hard.
            if !path.exists() {
                return Err(format!("fetching PyPI list: {e}").into());
            }
        }
    }
    let data = fs::read_to_string(&path)?;
    Ok(data.lines().map(String::from).collect())
}

/// Download the popularity list and write it flattened (name-per-line) for
/// fast keystroke-time lookups.
fn build_pypi_cache(path: &PathBuf) -> Result<()> {
    let body = http_get(PYPI_TOP_URL)?;
    let json: serde_json::Value = serde_json::from_slice(&body)?;
    let rows = json["rows"]
        .as_array()
        .ok_or("unexpected PyPI list format")?;
    let mut out = String::new();
    for r in rows {
        if let Some(name) = r["project"].as_str() {
            out.push_str(name);
            out.push('\n');
        }
    }
    if let Some(dir) = path.parent() {
        fs::create_dir_all(dir)?;
    }
    fs::write(path, out)?;
    Ok(())
}

fn stale(path: &PathBuf) -> bool {
    match fs::metadata(path).and_then(|m| m.modified()) {
        Ok(modified) => SystemTime::now()
            .duration_since(modified)
            .map(|age| age > CACHE_MAX_AGE)
            .unwrap_or(true),
        Err(_) => true,
    }
}

fn cache_path() -> Result<PathBuf> {
    let mut dir = dirs::cache_dir().ok_or("could not determine cache directory")?;
    dir.push("pips");
    dir.push("pypi-names.txt");
    Ok(dir)
}

// ---- npm live search ----

fn npm_suggest(query: &str, limit: usize) -> Result<Vec<String>> {
    let url = format!(
        "https://registry.npmjs.org/-/v1/search?text={}&size={}",
        percent_encode(query),
        limit
    );
    let body = http_get(&url)?;
    let json: serde_json::Value = serde_json::from_slice(&body)?;
    let objects = json["objects"]
        .as_array()
        .ok_or("unexpected npm response")?;
    let names = objects
        .iter()
        .filter_map(|o| o["package"]["name"].as_str().map(String::from))
        .collect();
    Ok(names)
}

// ---- http ----

fn http_get(url: &str) -> Result<Vec<u8>> {
    let agent = ureq::AgentBuilder::new()
        .timeout_connect(Duration::from_secs(10))
        .timeout_read(Duration::from_secs(10))
        .build();
    let resp = agent
        .get(url)
        .set("User-Agent", "pips (github.com/suraj7974/cliTools)")
        .call()?;
    let mut buf = Vec::new();
    resp.into_reader().read_to_end(&mut buf)?;
    Ok(buf)
}

/// Minimal percent-encoding for a query string (avoids pulling in a URL crate).
fn percent_encode(s: &str) -> String {
    let mut out = String::new();
    for b in s.bytes() {
        match b {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                out.push(b as char)
            }
            _ => out.push_str(&format!("%{b:02X}")),
        }
    }
    out
}

// ---- shell hook ----

const ZSH_HOOK: &str = r#"# pips — ghost-text suggestions for `pip install` (requires zsh-autosuggestions)
# https://github.com/suraj7974/cliTools
_zsh_autosuggest_strategy_pips() {
  emulate -L zsh
  typeset -g suggestion=""
  local buf="$1"
  # only for `pip|pip3|pips install <partial>` with a partial last word
  [[ "$buf" == (pip|pip3|pips)" install "* ]] || return
  local last="${buf##* }"
  [[ -n "$last" ]] || return
  local best="$(command pips best -- "$last" 2>/dev/null)"
  [[ -n "$best" && "$best" != "$last" ]] || return
  typeset -g suggestion="${buf%$last}$best"
}
# try pips first, then fall back to your existing strategies
ZSH_AUTOSUGGEST_STRATEGY=(pips "${ZSH_AUTOSUGGEST_STRATEGY[@]:-history}")
"#;
