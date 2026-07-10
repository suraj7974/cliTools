//! pips — ghost-text package suggestions for `pip` / `npm` / `pnpm` / `yarn`.
//!
//! Powers inline autosuggestion: as you type `pip install num` (or `npm install
//! expr`, `pnpm add lod`, ...), your shell shows the top package as dim ghost
//! text (via zsh-autosuggestions). Also usable directly:
//!
//!     pips best num           # -> numpy               (top match, used by the shell hook)
//!     pips list -n 5 num      # -> numpy, numba, ...    (top N)
//!     pips best -r npm expr   # -> express              (npm)
//!     pips update             # refresh the cached package lists
//!     pips init zsh           # print the shell hook to add to ~/.zshrc
//!
//! Neither registry offers a good live prefix-search API, so we cache
//! popularity-ranked lists (PyPI top packages; npm-high-impact) locally,
//! flattened to one name per line for fast keystroke-time matching.

use std::error::Error;
use std::fs;
use std::io::Read;
use std::path::PathBuf;
use std::time::{Duration, SystemTime};

/// Community-maintained dataset of the most-downloaded PyPI packages,
/// ordered most-popular first. Refreshed regularly upstream.
const PYPI_TOP_URL: &str = "https://hugovk.github.io/top-pypi-packages/top-pypi-packages.min.json";

/// npm-high-impact ships a download-ranked list of ~16k packages as a JS module.
const NPM_TOP_URL: &str = "https://unpkg.com/npm-high-impact/lib/top-download.js";

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
        "pips — ghost-text package suggestions for pip / npm / pnpm / yarn\n\
         \n\
         usage:\n\
         \x20 pips install [-y] <partial> [pip args]  resolve & run `pip install`\n\
         \x20 pips best [-r pypi|npm] <partial>        top match (used by the shell hook)\n\
         \x20 pips list [-r pypi|npm] [-n N] <partial> top N matches\n\
         \x20 pips update                              refresh the cached package lists\n\
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
    for registry in ["pypi", "npm"] {
        let path = cache_path(registry)?;
        build_cache(registry, &path)?;
        eprintln!("updated {registry} list -> {}", path.display());
    }
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
    let names = load_names(registry, false)?;
    Ok(rank(&names, partial, limit))
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

// ---- cached ranked lists (flat file: one name per line, popularity order) ----

/// Load popularity-ranked names for a registry, (re)building the cache if
/// missing, stale, or forced.
fn load_names(registry: &str, refresh: bool) -> Result<Vec<String>> {
    let path = cache_path(registry)?;
    if refresh || stale(&path) {
        if let Err(e) = build_cache(registry, &path) {
            // Fall back to an existing (stale) cache rather than failing hard.
            if !path.exists() {
                return Err(format!("fetching {registry} list: {e}").into());
            }
        }
    }
    let data = fs::read_to_string(&path)?;
    Ok(data.lines().map(String::from).collect())
}

/// Download a registry's ranked package list and write it flattened
/// (name-per-line) for fast keystroke-time lookups.
fn build_cache(registry: &str, path: &PathBuf) -> Result<()> {
    let names = match registry {
        "pypi" => fetch_pypi_names()?,
        "npm" => fetch_npm_names()?,
        other => return Err(format!("unknown registry {other:?} (use pypi or npm)").into()),
    };
    if let Some(dir) = path.parent() {
        fs::create_dir_all(dir)?;
    }
    fs::write(path, names.join("\n"))?;
    Ok(())
}

fn fetch_pypi_names() -> Result<Vec<String>> {
    let body = http_get(PYPI_TOP_URL)?;
    let json: serde_json::Value = serde_json::from_slice(&body)?;
    let rows = json["rows"]
        .as_array()
        .ok_or("unexpected PyPI list format")?;
    Ok(rows
        .iter()
        .filter_map(|r| r["project"].as_str().map(String::from))
        .collect())
}

fn fetch_npm_names() -> Result<Vec<String>> {
    // The file is a JS module: `export const topDownload = ['name', ...]`.
    // Package names never contain a single quote, so every single-quoted token
    // is a name (the tokens sit at odd indices between the quotes).
    let body = http_get(NPM_TOP_URL)?;
    let text = String::from_utf8_lossy(&body);
    let names: Vec<String> = text
        .split('\'')
        .skip(1)
        .step_by(2)
        .map(String::from)
        .collect();
    if names.is_empty() {
        return Err("could not parse npm list".into());
    }
    Ok(names)
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

fn cache_path(registry: &str) -> Result<PathBuf> {
    let mut dir = dirs::cache_dir().ok_or("could not determine cache directory")?;
    dir.push("pips");
    dir.push(format!("{registry}-names.txt"));
    Ok(dir)
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

// ---- shell hook ----

const ZSH_HOOK: &str = r#"# pips — ghost-text package suggestions (requires zsh-autosuggestions)
# https://github.com/suraj7974/cliTools
# Fires on pip / npm / pnpm / yarn install lines.
_zsh_autosuggest_strategy_pips() {
  emulate -L zsh
  typeset -g suggestion=""
  local buf="$1" reg=""
  case "$buf" in
    ("pip install "*|"pip3 install "*|"pips install "*) reg="pypi" ;;
    ("npm install "*|"npm i "*|"npm add "*)             reg="npm"  ;;
    ("pnpm add "*|"pnpm install "*|"pnpm i "*)          reg="npm"  ;;
    ("yarn add "*)                                      reg="npm"  ;;
    (*) return ;;
  esac
  local last="${buf##* }"
  [[ -n "$last" ]] || return
  local best="$(command pips best -r "$reg" -- "$last" 2>/dev/null)"
  [[ -n "$best" && "$best" != "$last" ]] || return
  typeset -g suggestion="${buf%$last}$best"
}
# try pips first, then fall back to your existing strategies
ZSH_AUTOSUGGEST_STRATEGY=(pips "${ZSH_AUTOSUGGEST_STRATEGY[@]:-history}")
"#;
