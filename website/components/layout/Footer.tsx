"use client";

import Link from "next/link";
import { Terminal } from "@/components/terminal/Terminal";
import { footerScript } from "@/data/tools";
import { AUTHOR, GITHUB_URL, TAP_URL } from "@/data/site";

export function Footer() {
  return (
    <footer className="hairline-t bg-[var(--paper-2)]">
      <div className="container-site py-14">
        <div className="mx-auto mb-12 max-w-md">
          <Terminal
            script={footerScript}
            autoPlay="inView"
            size="sm"
            ariaLabel="Terminal typing: thanks for scrolling"
          />
        </div>
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="font-mono text-sm text-[var(--ink-soft)]">
            <span className="font-semibold text-[var(--ink)]">cliTools</span>
            {"  ·  "}MIT © {AUTHOR} 2026
          </p>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/tools" className="link-accent">
              Tools
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              GitHub
            </a>
            <a
              href={TAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              Homebrew tap
            </a>
          </nav>
          <p className="font-mono text-sm text-[var(--ink-faint)]">
            Built in Go &amp; Rust
            <span className="wordmark-caret" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
}
