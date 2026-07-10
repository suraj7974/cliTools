# Releasing

How prebuilt binaries get to users. Source stays in this one repo; each tool is
released **individually** under its own tag.

## Tag convention (monorepo)

One repo holds many tools, so tags are **prefixed per tool** — never a bare `v1.0.0`:

```
sizehog-v0.1.0      # releases the Rust tool `sizehog`
envcheck-v0.1.0     # releases the Go tool `envcheck`
```

The prefix tells the release tooling *which* tool to build, so a tag only ships
that one binary.

## Rust tools → cargo-dist (`dist`)

Config lives in [`tools/rust/Cargo.toml`](tools/rust/Cargo.toml) under
`[workspace.metadata.dist]`.

**One-time setup** (installs `dist` and generates the CI workflow):
```bash
cargo install cargo-dist          # or: brew install dist
cd tools/rust
dist init --yes                    # reads the [metadata.dist] config, writes CI
```

> ⚠️ Monorepo caveat: `dist init` writes `.github/workflows/release.yml` relative
> to the cargo workspace (`tools/rust/`). GitHub only reads workflows from the
> **repo root** `.github/`, so move the generated file there after `init`.

**Cut a release:**
```bash
git tag sizehog-v0.1.0
git push --tags                    # CI builds Mac/Linux/Windows binaries + a
                                   # shell installer, attaches them to the release
```
Users then install with the one-liner from the release page, or download the
binary directly.

## Go tools → GoReleaser

Config lives in [`.goreleaser.yaml`](.goreleaser.yaml) (repo root). It's a template
until your first Go tool exists.

**Activate (once `tools/go/envcheck` exists):**
```bash
brew install goreleaser
# set `release.github.owner` in .goreleaser.yaml to your username
goreleaser check                   # validate the config
```

**Cut a release:**
```bash
git tag envcheck-v0.1.0
git push --tags
goreleaser release --clean         # or wire this into a GitHub Action
```

## The end-user experience (what all this produces)

- **GitHub Releases page** with a downloadable binary per OS/arch — no Go/Rust needed.
- **`cargo install` / `go install`** straight from the repo for devs.
- **Homebrew tap** (add `"homebrew"` to cargo-dist installers / GoReleaser `brews:`
  once you have a `homebrew-tools` tap) → `brew install <tool>`.
