# killport

Kill whatever process is listening on a given port.

```bash
killport 3000
```

## Build & run (from repo root)

```bash
just go-run killport 3000     # run without installing
just go-build killport        # produces tools/go/killport/bin/killport
just go-install killport      # installs onto your PATH
```

## How it works

1. Reads the port from `os.Args`.
2. Runs `lsof -t -i :<port>` to find PIDs holding the port (macOS/Linux).
3. Sends `kill -9` to each.

## Ideas to extend

- Add Windows support via `netstat -ano` + `taskkill`.
- Add `--dry-run` to print what would be killed.
- Swap manual arg parsing for [`cobra`](https://github.com/spf13/cobra) once you
  add flags — that's the library `gh` uses.
