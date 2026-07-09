# cliTools — task runner for a polyglot (Go + Rust) monorepo.
# Install `just`:  brew install just     Docs: https://github.com/casey/just
#
# Every folder under tools/ is just a directory in ONE git repo — not its own repo.
# These recipes tie the different language toolchains together under one command set.

# Show all available recipes
default:
    @just --list

# ---- Go ----

# Build a Go tool into its bin/:   just go-build killport
go-build tool:
    cd tools/go/{{tool}} && go build -o bin/{{tool}} .

# Run a Go tool directly:          just go-run killport 3000
go-run tool *args:
    cd tools/go/{{tool}} && go run . {{args}}

# Install a Go tool onto your PATH: just go-install killport
go-install tool:
    cd tools/go/{{tool}} && go install .

# ---- Rust ----

# Build a Rust tool (release):     just rust-build sizehog
rust-build tool:
    cd tools/rust && cargo build --release -p {{tool}}

# Run a Rust tool:                 just rust-run sizehog .
rust-run tool *args:
    cd tools/rust && cargo run -p {{tool}} -- {{args}}

# ---- Everything ----

# Build every tool in the repo
build-all:
    #!/usr/bin/env bash
    set -euo pipefail
    for d in tools/go/*/; do
      name=$(basename "$d")
      echo ">> building go/$name"
      (cd "$d" && go build -o "bin/$name" .)
    done
    echo ">> building all rust tools"
    (cd tools/rust && cargo build --release)

# Format Go + Rust code
fmt:
    cd tools/rust && cargo fmt
    gofmt -w tools/go
