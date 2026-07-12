# upwait

Block until a port or URL is up — the missing glue for startup scripts,
Docker entrypoints, and CI.

```bash
upwait localhost:5432 && npm start        # wait for postgres, then boot
upwait https://api.example.com -t 60      # wait for an endpoint, up to 60s
upwait db:5432 -q || echo "db never came up"
```

## Install

```bash
brew install suraj7974/tap/upwait   # or: cargo install upwait
```

## Flags

| Flag | Default | Meaning |
|------|---------|---------|
| `-t, --timeout <secs>` | `30` | Give up after this long |
| `-i, --interval <ms>` | `250` | Time between checks |
| `-q, --quiet` | | No output, just the exit code |

**Exit codes:** `0` when up · `1` on timeout · `2` bad usage.

## How it works

- `host:port` → tries a TCP connection each interval (unresolvable DNS counts
  as "not up yet", so it plays nice with containers that register late).
- `http://` / `https://` → sends a GET; any response with status `< 500`
  counts as up (a 404 still means the server is alive), while `5xx` keeps
  waiting since the app is likely still booting.

## Build & run (from repo root)

```bash
just rust-run upwait localhost:5432
just rust-build upwait
```
