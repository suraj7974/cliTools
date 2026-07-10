"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Terminal } from "@/components/terminal/Terminal";
import { buildFrames } from "@/components/terminal/buildFrames";
import { useReducedMotionPref } from "@/components/terminal/useTerminalScript";
import { InstallTabs } from "@/components/ui/InstallTabs";
import { Reveal } from "@/components/ui/Reveal";
import type { Tool } from "@/data/tools";

interface ReviewBlockProps {
  tool: Tool;
  flip?: boolean;
}

const ADVANCE_DELAY = 1500;

/**
 * A full deep-dive review. The demo plays scene by scene in real time,
 * auto-advancing; steps are clickable to jump. No scroll-jacking.
 */
export function ReviewBlock({ tool, flip = false }: ReviewBlockProps) {
  const reduced = useReducedMotionPref();
  const [scene, setScene] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const count = tool.scenes.length;

  // stable terminal height across all scenes — no resize between them
  const minLines = useMemo(
    () => Math.max(...tool.scenes.map((s) => buildFrames(s).maxLines)),
    [tool.scenes],
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

  const demo = (
    <Reveal>
      <Terminal
        key={scene}
        script={tool.scenes[scene]}
        autoPlay="inView"
        size="lg"
        minLines={minLines}
        onComplete={handleComplete}
        ariaLabel={`Terminal demo of ${tool.name}: ${tool.tagline}`}
      />
    </Reveal>
  );

  const copy = (
    <Reveal delay={0.08}>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-mono text-4xl font-semibold tracking-tight text-[var(--ink)]">
          {tool.name}
        </h2>
        <span className="chip">v{tool.version}</span>
        <span className="chip">{tool.lang}</span>
      </div>
      <p className="text-body-lg mt-3">{tool.tagline}</p>
      <p className="mt-5 border-l-2 border-[var(--accent)] pl-4 font-mono text-[1.0625rem] italic text-[var(--accent-ink)]">
        “{tool.verdict}”
      </p>

      <ol className="mt-9 space-y-1.5">
        {tool.howItWorks.map((step, i) => {
          const active = reduced || i === scene;
          return (
            <li key={step.title}>
              <button
                type="button"
                onClick={() => jumpTo(i)}
                aria-pressed={i === scene}
                className={`w-full rounded-lg border-l-2 px-4 py-2.5 text-left transition-all duration-300 ${
                  active
                    ? "border-[var(--accent)] bg-[var(--term-bg)]"
                    : "border-[var(--line)] opacity-55 hover:opacity-80"
                }`}
              >
                <span className="block font-medium text-[var(--ink)]">
                  <span className="mr-2 font-mono text-[0.8125rem] text-[var(--ink-faint)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {step.title}
                </span>
                {active ? (
                  <span className="text-body mt-1 block text-[0.9375rem]">
                    {step.body}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-10">
        <InstallTabs
          options={tool.install}
          note={tool.note}
          idPrefix={`install-${tool.slug}`}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--line)] pt-5 text-sm">
        <a
          href={tool.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-accent font-medium"
        >
          View source ↗
        </a>
        <span className="font-mono text-[var(--ink-faint)]">
          v{tool.version}
        </span>
        <span className="font-mono text-[var(--ink-faint)]">MIT</span>
      </div>
    </Reveal>
  );

  return (
    <section id={tool.slug} className="section scroll-mt-28">
      <div className="container-site">
        <div
          className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16 ${
            flip ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          {demo}
          {copy}
        </div>
      </div>
    </section>
  );
}
