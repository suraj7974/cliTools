# cliTools

A monorepo of small, useful command-line tools — built to learn how real CLIs
(like `gh` and `npm`) are made: argument parsing, OS detection, subprocess
handling, config files, packaging, and distribution.

Primary languages: **Go** (default) and **Rust** (for file/perf-heavy tools).
A **website** documenting every tool lives in `website/`.

> Progress tracker: [`PROGRESS.md`](PROGRESS.md). Idea backlog: [`docs/`](docs/).

## How this monorepo works

This is **one git repository**. Every folder below is just a directory — *not*
its own repo. You clone once, you `git push` once, and a single commit can touch
a Go tool, a Rust tool, and the website together.

- "Independently publishable" means each tool's **binary** can be released on its
  own (`go install .../<tool>`, `cargo install`) — it does **not** mean a
  separate git repo. Source stays here.
- The opposite model (one repo per tool) is "polyrepo" — deliberately not used
  here, since these are many small, related tools.

## Layout

```
cliTools/
├── Justfile              # one command to build/run/install any tool
├── tools/
│   ├── go/               # Go workspace (go.work) — one module per tool
│   │   └── envcheck/     # (planned) diff .env vs .env.example
│   └── rust/             # Cargo workspace — one crate per tool
│       └── sizehog/      # find the biggest files under a path
├── website/              # explainer site (add later)
└── docs/                 # per-tool markdown the website can read
```

## Prerequisites

- [Go](https://go.dev/dl/) 1.22+
- [Rust](https://rustup.rs/) (stable)
- [`just`](https://github.com/casey/just) — the task runner (`brew install just`)

## Quick start

```bash
just                       # list all recipes
just rust-run sizehog .    # run the Rust tool on the current dir
just build-all             # build everything
```

## Adding a new tool

**Go:** `mkdir tools/go/<name>`, add `main.go` + `go.mod`, then add the folder to
`tools/go/go.work` (`use ./<name>`).

**Rust:** `cd tools/rust && cargo new <name>`, then add `<name>` to the `members`
list in `tools/rust/Cargo.toml`.

## Git workflow (one repo, one push)

```bash
git add .
git commit -m "add <thing>"
git push            # pushes the whole monorepo
```
