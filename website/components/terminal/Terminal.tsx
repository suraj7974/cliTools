"use client";

import { type AutoPlay, useTerminalScript } from "./useTerminalScript";
import type { TerminalScript } from "./types";

interface TerminalProps {
  script: TerminalScript;
  autoPlay?: AutoPlay;
  replay?: boolean;
  scrubProgress?: number;
  playing?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  ariaLabel?: string;
  /** reserve at least this many lines (stable height across swapped scripts) */
  minLines?: number;
  /** fires once when a non-looping script finishes playing */
  onComplete?: () => void;
}

/**
 * The one terminal. Every demo on the site is this component playing a script
 * from data/tools.ts — no one-off animations.
 */
export function Terminal({
  script,
  autoPlay = "inView",
  replay = false,
  scrubProgress,
  playing,
  size = "md",
  className = "",
  ariaLabel,
  minLines,
  onComplete,
}: TerminalProps) {
  const { frame, built, containerRef } = useTerminalScript(script, {
    autoPlay,
    replay,
    scrubProgress,
    playing,
    onComplete,
  });

  const sizeClass =
    size === "sm" ? "term--sm" : size === "lg" ? "term--lg" : "";

  return (
    <div
      ref={containerRef}
      className={`term ${sizeClass} ${className}`}
      role="img"
      aria-label={ariaLabel ?? `Terminal demo: ${script.title ?? script.id}`}
    >
      <div className="term__bar" aria-hidden="true">
        <div className="term__dots">
          <span className="term__dot" />
          <span className="term__dot" />
          <span className="term__dot" />
        </div>
        {script.title ? (
          <span className="term__title">{script.title}</span>
        ) : null}
      </div>
      <div
        className="term__body"
        style={{
          minHeight: `calc(${Math.max(built.maxLines, minLines ?? 0)} * 1.55em + 0.2em)`,
        }}
      >
        {frame.lines.map((l, li) => {
          const isLast = li === frame.lines.length - 1;
          // caret sits between typed text and the ghost suggestion,
          // exactly like real shell autosuggest
          const solid = l.spans.filter((s) => !s.ghost);
          const ghosts = l.spans.filter((s) => s.ghost);
          const renderSpan = (
            s: (typeof l.spans)[number],
            key: string | number,
          ) => (
            <span
              key={key}
              className={
                s.ghost || s.flash
                  ? "term-ghost"
                  : s.tone
                    ? `tone-${s.tone}`
                    : "tone-ink"
              }
              data-flash={s.flash ? "true" : undefined}
            >
              {s.text}
            </span>
          );
          return (
            <div key={li}>
              {l.prompt ? (
                <span className="term__prompt">{l.prompt}</span>
              ) : null}
              {solid.map((s, si) => renderSpan(s, `s${si}`))}
              {isLast && frame.caret ? (
                <span
                  className="caret"
                  data-idle={frame.typing ? "false" : "true"}
                  aria-hidden="true"
                />
              ) : null}
              {ghosts.map((s, si) => renderSpan(s, `g${si}`))}
              {isLast && frame.keycap ? (
                <kbd className="keycap" aria-hidden="true" key={frame.keycap}>
                  {frame.keycap}
                </kbd>
              ) : null}
            </div>
          );
        })}
        {frame.lines.length === 0 && frame.caret !== false ? (
          <div>
            <span className="caret" data-idle="true" aria-hidden="true" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
