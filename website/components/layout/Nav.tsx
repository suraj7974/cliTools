"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GITHUB_URL } from "@/data/site";

/** Minimal sticky nav: transparent over the hero, frosted after scroll. */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--paper)_82%,transparent)] backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav
        className={`container-site flex items-center justify-between transition-all duration-300 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <Link
          href="/"
          className="font-mono text-[0.9375rem] font-semibold tracking-tight text-[var(--ink)]"
        >
          cliTools
          <span className="wordmark-caret" aria-hidden="true" />
        </Link>
        <div className="flex items-center gap-5">
          <span className="chip hidden sm:inline-flex">Rust</span>
          <Link
            href="/tools"
            className="text-[0.9375rem] font-medium text-[var(--ink-soft)] hover:text-[var(--ink)]"
          >
            Tools
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.9375rem] font-medium text-[var(--ink-soft)] hover:text-[var(--ink)]"
          >
            GitHub ↗
          </a>
        </div>
      </nav>
    </header>
  );
}
