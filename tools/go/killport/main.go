// killport — kill whatever process is listening on a given port.
//
//	killport 3000
//
// A first Go CLI: argument handling, OS detection, subprocess calls, exit codes.
// Uses `lsof` (macOS/Linux). Windows support is left as an exercise (see netstat).
package main

import (
	"fmt"
	"os"
	"os/exec"
	"runtime"
	"strings"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintln(os.Stderr, "usage: killport <port>")
		os.Exit(2)
	}
	port := os.Args[1]

	pids, err := findPIDs(port)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}
	if len(pids) == 0 {
		fmt.Printf("no process is using port %s\n", port)
		return
	}

	failed := false
	for _, pid := range pids {
		if err := kill(pid); err != nil {
			fmt.Fprintf(os.Stderr, "failed to kill pid %s: %v\n", pid, err)
			failed = true
			continue
		}
		fmt.Printf("killed process %s on port %s\n", pid, port)
	}
	if failed {
		os.Exit(1)
	}
}

// findPIDs returns the process IDs listening on the given port.
func findPIDs(port string) ([]string, error) {
	if runtime.GOOS == "windows" {
		return nil, fmt.Errorf("windows is not supported yet")
	}
	out, err := exec.Command("lsof", "-t", "-i", ":"+port).Output()
	if err != nil {
		// lsof exits with status 1 when it finds nothing — that's not an error for us.
		if _, ok := err.(*exec.ExitError); ok {
			return nil, nil
		}
		return nil, err
	}
	return strings.Fields(string(out)), nil
}

// kill sends SIGKILL to a pid.
func kill(pid string) error {
	return exec.Command("kill", "-9", pid).Run()
}
