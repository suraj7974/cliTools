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

> 🚧 Early days — the first tools are being built. Detailed install and usage docs
> will land here as the collection grows.

## Repository layout

```
cliTools/
├── tools/
│   ├── go/          # Go tools   — one module per tool (go.work workspace)
│   └── rust/        # Rust tools — one crate per tool (Cargo workspace)
└── website/         # docs
```

Why a monorepo? These are many small, related tools — keeping them together means
one clone, one issue tracker, and shared tooling, while each tool still releases
its own binary independently.

## Building from source

Uses [`just`](https://github.com/casey/just) as the task runner. Prerequisites:
[Go](https://go.dev/dl/) 1.22+, [Rust](https://rustup.rs), and `just`
(`brew install just`).

```bash
just                # list all recipes
just build-all      # build every tool
```

## Contributing

New tools and improvements are welcome. Keep each tool small and focused —
one job, done well.

- **Add a Rust tool:** `cd tools/rust && cargo new <name>`, then add it to
  `members` in `tools/rust/Cargo.toml`.
- **Add a Go tool:** `mkdir tools/go/<name>`, add `main.go` + `go.mod`, then
  `use ./<name>` in `tools/go/go.work`.

## License

[MIT](LICENSE) © Suraj Patel
