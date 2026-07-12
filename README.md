<h1 align="center">cliTools</h1>

<p align="center">
  A growing collection of small, fast, single-purpose command-line tools.<br>
  Built in <strong>Go</strong> and <strong>Rust</strong> — each does one useful thing well.
</p>

<p align="center">
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
</p>

---

This is a monorepo: one repository, many independent tools. Each tool is small,
focused, and ships its own binary — install only the one you need, with no shared
runtime or dependencies between them.

## Tools

Click a tool to expand its guide.

<details>
<summary><b>🦀 pips</b> — ghost-text package suggestions for pip / npm / pnpm / yarn</summary>

<br>

`pips` gets you the right package name two ways:

- **Ghost text** — as you type `pip install num` (or `npm install expr`,
  `pnpm add lod`, `yarn add …`), your shell shows the most-popular match as dim
  text; press <kbd>→</kbd> to accept, <kbd>Enter</kbd> to run.
  *(needs the zsh-autosuggestions plugin — step 2)*
- **Direct** — run `pips install num` and it resolves to the top package and runs
  `pip install` for you, asking first. *(works in any shell, no plugin needed)*

```
$ pip install num‸numpy      ← ghost text; → to accept
$ npm install expr‸ess
$ pips install num           → "Install 'numpy'? [Y/n]" → pip install numpy
```

### 1. Install `pips`

> The package is named `pips-cli` (the name `pips` was taken on crates.io), but
> every method installs the command as **`pips`** — same as `fd-find` → `fd`.

```bash
# Homebrew (recommended)
brew install suraj7974/tap/pips-cli

# crates.io (needs Rust)
cargo install pips-cli

# install script (macOS/Linux)
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/suraj7974/cliTools/releases/latest/download/pips-cli-installer.sh | sh
```

### 2. Install `zsh-autosuggestions` (only for the ghost text)

`pips` renders its ghost text through the popular
[`zsh-autosuggestions`](https://github.com/zsh-users/zsh-autosuggestions) plugin.
If you already have it, skip ahead.

```bash
# Homebrew
brew install zsh-autosuggestions
echo "source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh" >> ~/.zshrc

# or oh-my-zsh
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

Now `pip install num` shows `numpy` as ghost text, or run `pips install num`
directly.

### Windows

The `pips install num` command works in PowerShell/CMD (install via the
`pips-cli-installer.ps1` script or `cargo install pips-cli`). The inline **ghost
text needs zsh**, so for that experience use **WSL** with zsh-autosuggestions.

### No zsh / no plugin?

`pips` still works as a plain lookup command anywhere:

```bash
pips list num          # numpy, numba, numexpr, ...
pips list -n 5 requ    # top 5
pips list -r npm expr  # express, express-rate-limit, ...
```

More: [`tools/rust/pips`](tools/rust/pips)

</details>

<details>
<summary><b>🦀 upwait</b> — block until a port or URL is up</summary>

<br>

The missing glue for startup scripts, Docker entrypoints, and CI. `sleep` waits
for a guess; `upwait` waits for the truth — it polls the target and exits `0`
the moment it actually answers, so `&&` chains run at exactly the right time.

```bash
docker start postgres
upwait localhost:5432 && npm start        # app connects on the first try

upwait https://api.example.com -t 60      # wait for an endpoint, up to 60s
upwait db:5432 -q || echo "db never came up"
```

**Install** (pick one):

```bash
# Homebrew
brew install suraj7974/tap/upwait

# install script (macOS/Linux) — no toolchain needed
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/suraj7974/cliTools/releases/latest/download/upwait-installer.sh | sh

# crates.io (needs Rust)
cargo install upwait
```

**Flags:** `-t/--timeout <secs>` (default 30) · `-i/--interval <ms>` (default 250) ·
`-q/--quiet`. Exit codes: `0` up · `1` timeout.

Works with `host:port` (TCP) or `http(s)://` URLs — any response below 500
counts as up, `5xx` keeps waiting while the app boots.

More: [`tools/rust/upwait`](tools/rust/upwait)

</details>

<details>
<summary><b>🦀 sizehog</b> — find the biggest files under a directory</summary>

<br>

Find the biggest files under any directory, sorted, human-readable.

**Install** (pick one):

```bash
# Homebrew
brew install suraj7974/tap/sizehog

# install script (macOS/Linux) — no toolchain needed
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/suraj7974/cliTools/releases/latest/download/sizehog-installer.sh | sh

# crates.io (needs Rust)
cargo install sizehog
```

**Use:**

```bash
sizehog .            # biggest files under the current directory
sizehog ~/Downloads  # ...under any path
```

More: [`tools/rust/sizehog`](tools/rust/sizehog)

</details>

---

## Repository layout

```
cliTools/
├── tools/
│   ├── go/          # Go tools   — one module per tool (go.work workspace)
│   └── rust/        # Rust tools — one crate per tool (Cargo workspace)
│       ├── pips/
│       ├── upwait/
│       └── sizehog/
└── website/         # docs site (coming soon)
```

Why a monorepo? These are many small, related tools — keeping them together means
one clone, one issue tracker, and shared tooling, while each tool still releases
its own binary independently.

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
