"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Terminal } from "@/components/terminal/Terminal";
import { buildFrames } from "@/components/terminal/buildFrames";
import { useReducedMotionPref } from "@/components/terminal/useTerminalScript";
import { CopyCommand } from "@/components/ui/CopyCommand";
import { Reveal } from "@/components/ui/Reveal";
import { tools } from "@/data/tools";

const pips = tools[0];
const ADVANCE_DELAY = 1500;

export function FeaturedPips() {
  const reduced = useReducedMotionPref();
  const [scene, setScene] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const count = pips.scenes.length;

  // stable terminal height across all scenes — no resize between them
  const minLines = useMemo(
    () => Math.max(...pips.scenes.map((s) => buildFrames(s).maxLines)),
    [],
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleComplete = () => {
    if (reduced) return;
    timer.current = setTimeout(
      () => setScene((s) => (s + 1) % count),
      ADVANCE_DELAY,
    );
  };

  const jumpTo = (i: number) => {
    if (timer.current) clearTimeout(timer.current);
    setScene(i);
  };

  return (
    <section className="section">
      <div className="container-site">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
          {/* identity + steps */}
          <Reveal>
            <p className="text-caption !text-[var(--accent-ink)]">
              Featured tool
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h2 className="font-mono text-4xl font-semibold tracking-tight text-[var(--ink)]">
                {pips.name}
              </h2>
              <span className="chip">v{pips.version}</span>
              <span className="chip">{pips.lang}</span>
            </div>
            <p className="text-body-lg mt-4">{pips.tagline}</p>

            <ul className="mt-8 space-y-1.5">
              {pips.howItWorks.map((step, i) => {
                const active = reduced || i === scene;
                return (
                  <li key={step.title}>
                    <button
                      type="button"
                      onClick={() => jumpTo(i)}
                      aria-pressed={i === scene}
                      className={`w-full cursor-pointer rounded-lg px-4 py-2.5 text-left ${
                        active
                          ? "bg-[var(--surface)] shadow-[0_1px_2px_rgba(24,24,27,0.05)]"
                          : "opacity-55"
                      }`}
                    >
                      <span className="block font-medium text-[var(--ink)]">
                        {step.title}
                      </span>
                      {/* body always rendered — fixed box height, nothing below shifts */}
                      <span className="text-body mt-1 block text-[0.9375rem]">
                        {step.body}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 space-y-2.5">
              {pips.install.map((opt) => (
                <CopyCommand key={opt.label} command={opt.command} />
              ))}
              {pips.note ? <span className="chip">{pips.note}</span> : null}
            </div>

            <p className="mt-7">
              <Link href="/tools#pips" className="link-accent font-medium">
                Full pips review →
              </Link>
            </p>
          </Reveal>

          {/* the demo — plays in real time, then advances to the next scene */}
          <Reveal delay={0.08}>
            <Terminal
              key={scene}
              script={pips.scenes[scene]}
              autoPlay="inView"
              size="lg"
              minLines={minLines}
              onComplete={handleComplete}
              ariaLabel="Terminal demo of pips: ghost-text suggestions, confirmed installs, lookups, and npm, pnpm and yarn support."
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
