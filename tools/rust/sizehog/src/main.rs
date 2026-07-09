//! sizehog — find the biggest files under a path.
//!
//!     sizehog .          # biggest files under the current directory
//!     sizehog /var/log   # ...under a given directory
//!
//! A first Rust CLI: args, recursion, filesystem metadata, formatted output.

use std::env;
use std::fs;
use std::path::Path;

const TOP: usize = 10;

fn main() {
    let args: Vec<String> = env::args().collect();
    let root = args.get(1).map(String::as_str).unwrap_or(".");

    let mut files: Vec<(u64, String)> = Vec::new();
    collect(Path::new(root), &mut files);
    files.sort_by(|a, b| b.0.cmp(&a.0)); // largest first

    println!("Top {} largest files under {}:", TOP, root);
    for (size, path) in files.iter().take(TOP) {
        println!("{:>10}  {}", human(*size), path);
    }
}

/// Recursively collect (size, path) for every regular file under `dir`.
fn collect(dir: &Path, files: &mut Vec<(u64, String)>) {
    let entries = match fs::read_dir(dir) {
        Ok(e) => e,
        Err(_) => return, // skip unreadable dirs
    };
    for entry in entries.flatten() {
        let path = entry.path();
        if path.is_symlink() {
            continue; // don't follow symlinks (avoids loops)
        }
        if path.is_dir() {
            collect(&path, files);
        } else if let Ok(meta) = path.metadata() {
            files.push((meta.len(), path.display().to_string()));
        }
    }
}

/// Format a byte count as a human-readable string (e.g. "1.5 MB").
fn human(bytes: u64) -> String {
    const UNITS: [&str; 5] = ["B", "KB", "MB", "GB", "TB"];
    let mut size = bytes as f64;
    let mut unit = 0;
    while size >= 1024.0 && unit < UNITS.len() - 1 {
        size /= 1024.0;
        unit += 1;
    }
    format!("{:.1} {}", size, UNITS[unit])
}
