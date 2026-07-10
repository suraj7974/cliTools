"use client";

import { useEffect, useState } from "react";
import { tools } from "@/data/tools";

/** Sticky anchor nav for /tools; highlights the review currently in view. */
export function ToolsSubNav() {
  const [active, setActive] = useState<string>(tools[0]?.slug ?? "");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    for (const t of tools) {
      const el = document.getElementById(t.slug);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <div className="sticky top-[3.4rem] z-40 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--paper)_85%,transparent)] backdrop-blur-md">
      <div className="container-site flex items-center justify-between py-3">
        <nav className="flex items-center gap-1" aria-label="Tools on this page">
          {tools.map((t) => (
            <a
              key={t.slug}
              href={`#${t.slug}`}
              aria-current={active === t.slug ? "true" : undefined}
              className={`rounded-md px-3 py-1.5 font-mono text-[0.8125rem] ${
                active === t.slug
                  ? "bg-[var(--accent-wash)] text-[var(--accent-ink)]"
                  : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
              }`}
            >
              {t.name}
            </a>
          ))}
        </nav>
        <p className="hidden font-mono text-[0.75rem] text-[var(--ink-faint)] sm:block">
          {tools.length} shipped · more on the way
        </p>
      </div>
    </div>
  );
}
