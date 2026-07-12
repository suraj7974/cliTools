//! upwait — block until a port or URL is up.
//!
//!     upwait localhost:5432 && npm start
//!     upwait https://api.example.com -t 60
//!
//! Polls a TCP host:port or an http(s) URL until it responds, then exits 0.
//! Exits 1 on timeout — made for `&&` chains in startup scripts, Docker
//! entrypoints, and CI.

use std::net::{TcpStream, ToSocketAddrs};
use std::process::exit;
use std::time::{Duration, Instant};

const DEFAULT_TIMEOUT_SECS: u64 = 30;
const DEFAULT_INTERVAL_MS: u64 = 250;
const CONNECT_TIMEOUT_MS: u64 = 1000;

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();

    let mut target: Option<String> = None;
    let mut timeout = Duration::from_secs(DEFAULT_TIMEOUT_SECS);
    let mut interval = Duration::from_millis(DEFAULT_INTERVAL_MS);
    let mut quiet = false;

    let mut i = 0;
    while i < args.len() {
        match args[i].as_str() {
            "-t" | "--timeout" => {
                i += 1;
                match args.get(i).and_then(|s| s.parse::<u64>().ok()) {
                    Some(secs) => timeout = Duration::from_secs(secs),
                    None => usage_exit("expected seconds after -t"),
                }
            }
            "-i" | "--interval" => {
                i += 1;
                match args.get(i).and_then(|s| s.parse::<u64>().ok()) {
                    Some(ms) => interval = Duration::from_millis(ms),
                    None => usage_exit("expected milliseconds after -i"),
                }
            }
            "-q" | "--quiet" => quiet = true,
            "-h" | "--help" => {
                usage();
                return;
            }
            s if !s.starts_with('-') && target.is_none() => target = Some(s.to_string()),
            other => usage_exit(&format!("unknown argument: {other}")),
        }
        i += 1;
    }

    let target = match target {
        Some(t) => t,
        None => {
            usage();
            exit(2);
        }
    };

    let is_url = target.starts_with("http://") || target.starts_with("https://");
    if !is_url && !target.contains(':') {
        usage_exit("target must be host:port or an http(s):// URL");
    }

    if !quiet {
        eprintln!("waiting for {target} (timeout {}s)…", timeout.as_secs());
    }

    let start = Instant::now();
    loop {
        let up = if is_url {
            check_url(&target)
        } else {
            check_tcp(&target)
        };

        if up {
            if !quiet {
                eprintln!(
                    "✓ {target} is up after {:.1}s",
                    start.elapsed().as_secs_f64()
                );
            }
            return;
        }

        if start.elapsed() >= timeout {
            if !quiet {
                eprintln!(
                    "✗ timed out after {}s waiting for {target}",
                    timeout.as_secs()
                );
            }
            exit(1);
        }

        std::thread::sleep(interval);
    }
}

/// TCP check: can we open a connection to host:port?
fn check_tcp(target: &str) -> bool {
    let addrs = match target.to_socket_addrs() {
        Ok(a) => a,
        Err(_) => return false, // DNS not resolving yet counts as "not up"
    };
    for addr in addrs {
        if TcpStream::connect_timeout(&addr, Duration::from_millis(CONNECT_TIMEOUT_MS)).is_ok() {
            return true;
        }
    }
    false
}

/// HTTP(S) check: did the server respond at all (status < 500)?
/// 2xx–4xx means something is listening and serving; 5xx usually means
/// the app behind the port is still starting, so we keep waiting.
fn check_url(url: &str) -> bool {
    let agent = ureq::AgentBuilder::new()
        .timeout_connect(Duration::from_millis(CONNECT_TIMEOUT_MS))
        .timeout(Duration::from_secs(3))
        .build();
    match agent.get(url).call() {
        Ok(_) => true,
        Err(ureq::Error::Status(code, _)) => code < 500,
        Err(_) => false,
    }
}

fn usage() {
    eprint!(
        "upwait — block until a port or URL is up\n\
         \n\
         usage:\n\
         \x20 upwait <host:port | url> [flags]\n\
         \n\
         flags:\n\
         \x20 -t, --timeout <secs>   give up after this long (default 30)\n\
         \x20 -i, --interval <ms>    time between checks (default 250)\n\
         \x20 -q, --quiet            no output, just the exit code\n\
         \n\
         exit code: 0 when up · 1 on timeout\n\
         \n\
         examples:\n\
         \x20 upwait localhost:5432 && npm start\n\
         \x20 upwait https://api.example.com -t 60\n\
         \x20 upwait db:5432 -q || echo 'db never came up'\n"
    );
}

fn usage_exit(msg: &str) -> ! {
    eprintln!("error: {msg}\n");
    usage();
    exit(2);
}
