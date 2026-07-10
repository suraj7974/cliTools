<h1 align="center">cliTools</h1>

<p align="center">
  A growing collection of small, fast, single-purpose command-line tools.<br>
  Built in <strong>Go</strong> and <strong>Rust</strong> — each does one useful thing well.
</p>

<p align="center">
  <a href="https://github.com/suraj7974/cliTools/releases"><img alt="Latest release" src="https://img.shields.io/github/v/release/suraj7974/cliTools?sort=semver"></a>
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
</p>

---

This is a monorepo: one repository, many independent tools. Each tool is small,
focused, and ships its own binary — install only the one you need, with no shared
runtime or dependencies between them.

## Tools

| Tool | Lang | What it does |
|------|:----:|--------------|
| [`sizehog`](tools/rust/sizehog) | 🦀 Rust | Find the biggest files under a directory |
| [`pips`](tools/rust/pips) | 🦀 Rust | Ghost-text suggestions for `pip install` as you type |

---

## sizehog

Find the biggest files under any directory, sorted, human-readable.

**Install** (pick one):

```bash
# Homebrew
brew install suraj7974/tap/sizehog

# install script (macOS/Linux) — no toolchain needed
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/suraj7974/cliTools/releases/latest/download/sizehog-installer.sh | sh

# from crates.io (needs Rust)
cargo install sizehog
```

**Use:**

```bash
sizehog .            # biggest files under the current directory
sizehog ~/Downloads  # ...under any path
```

---

## pips

As you type `pip install num`, your shell shows the most-popular matching
package (`numpy`) as dim **ghost text** — press <kbd>→</kbd> to accept,
<kbd>Enter</kbd> to run. No separate command, no interruption.

```
$ pip install num‸numpy      ← "numpy" is ghost text
```

### 1. Install `pips` (pick one)

```bash
# Homebrew (recommended)
brew install suraj7974/tap/pips

# install script (macOS/Linux)
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/suraj7974/cliTools/releases/latest/download/pips-installer.sh | sh

# from source (needs Rust)
cargo install --git https://github.com/suraj7974/cliTools pips
```

### 2. Install `zsh-autosuggestions` (if you don't have it)

`pips` renders its ghost text through the popular
[`zsh-autosuggestions`](https://github.com/zsh-users/zsh-autosuggestions) plugin
(the same one that ghosts your shell history). If you already have it, skip ahead.

**With Homebrew:**
```bash
brew install zsh-autosuggestions
echo "source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh" >> ~/.zshrc
```

**With oh-my-zsh:**
```bash
git clone https://github.com/zsh-users/zsh-autosuggestions \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# then add zsh-autosuggestions to the plugins=(...) line in ~/.zshrc
```

### 3. Enable `pips`

```bash
pips update                    # download the package list (once)
pips init zsh >> ~/.zshrc       # add the shell hook
exec zsh                        # reload your shell
```

Now type `pip install num` in any prompt — `numpy` appears as ghost text.

### Don't use zsh / don't want the plugin?

`pips` still works as a plain lookup command:

```bash
pips list num          # numpy, numba, numexpr, ...
pips list -n 5 requ    # top 5
pips list -r npm expr  # live npm search
```

Without `zsh-autosuggestions` the shell hook simply does nothing — no errors, no
slowdown, your shell behaves normally; you just won't see the inline ghost text.

---

## Repository layout

```
cliTools/
├── tools/
│   ├── go/          # Go tools   — one module per tool (go.work workspace)
│   └── rust/        # Rust tools — one crate per tool (Cargo workspace)
│       ├── sizehog/
│       └── pips/
└── website/        
```


## Building from source

Uses [`just`](https://github.com/casey/just) as the task runner. Prerequisites:
[Go](https://go.dev/dl/) 1.22+, [Rust](https://rustup.rs), and `just`
(`brew install just`).

```bash
just                       # list all recipes
just rust-run sizehog .    # build & run a Rust tool
just build-all             # build every tool
```

## Contributing

New tools and improvements are welcome. Keep each tool small and focused —
one job, done well.

- **Add a Rust tool:** `cd tools/rust && cargo new <name>`, then add it to
  `members` in `tools/rust/Cargo.toml`.
- **Add a Go tool:** `mkdir tools/go/<name>`, add `main.go` + `go.mod`, then
  `use ./<name>` in `tools/go/go.work`.

## Releasing

Maintainers: releases are triggered by pushing a per-tool tag (e.g.
`sizehog-v0.1.0`); CI builds cross-platform binaries + installers and publishes
the Homebrew formula automatically.

## License

[MIT](LICENSE) © Suraj Patel
