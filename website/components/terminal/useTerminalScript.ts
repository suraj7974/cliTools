"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildFrames, frameIndexAt } from "./buildFrames";
import type { Frame, TerminalScript } from "./types";

export type AutoPlay = "onMount" | "inView" | "manual" | "scrubbed";

interface Options {
  autoPlay?: AutoPlay;
  replay?: boolean;
  scrubProgress?: number; // 0..1, only for autoPlay="scrubbed"
  playing?: boolean; // only for autoPlay="manual"
  onComplete?: () => void; // fires once when a non-looping script finishes
}

const LOOP_TAIL = 1400;

export function useReducedMotionPref(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * The single playback engine behind every terminal on the site.
 * Deterministic frames + a clock (rAF) or a scrub position — nothing else.
 */
export function useTerminalScript(
  script: TerminalScript,
  {
    autoPlay = "inView",
    replay = false,
    scrubProgress,
    playing = false,
    onComplete,
  }: Options = {},
) {
  const built = useMemo(() => buildFrames(script), [script]);
  const reduced = useReducedMotionPref();
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const activeRef = useRef(false);
  const indexRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const completedRef = useRef(false);

  const setIdx = (i: number) => {
    if (indexRef.current !== i) {
      indexRef.current = i;
      setIndex(i);
    }
  };

  // reduced motion → jump straight to the final composed state
  useEffect(() => {
    if (reduced) setIdx(built.frames.length - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, built]);

  // scrubbed mode: scroll owns the clock
  useEffect(() => {
    if (autoPlay !== "scrubbed" || reduced) return;
    const p = Math.min(1, Math.max(0, scrubProgress ?? 0));
    setIdx(frameIndexAt(built, p * built.total));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, scrubProgress, built, reduced]);

  // clock-driven modes
  useEffect(() => {
    if (reduced || autoPlay === "scrubbed") return;

    const tick = (now: number) => {
      if (!activeRef.current) return;
      const elapsed = now - startRef.current;
      if (elapsed > built.total + LOOP_TAIL && script.loop) {
        startRef.current = now;
        setIdx(0);
      } else if (elapsed >= built.total && !script.loop) {
        setIdx(built.frames.length - 1);
        activeRef.current = false;
        if (!completedRef.current) {
          completedRef.current = true;
          onCompleteRef.current?.();
        }
        return;
      } else {
        setIdx(frameIndexAt(built, Math.min(elapsed, built.total)));
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const start = (restart: boolean) => {
      if (activeRef.current) return;
      activeRef.current = true;
      startRef.current =
        performance.now() -
        (restart ? 0 : built.frames[indexRef.current]?.t ?? 0);
      if (restart) setIdx(0);
      rafRef.current = requestAnimationFrame(tick);
    };

    const stop = () => {
      activeRef.current = false;
      cancelAnimationFrame(rafRef.current);
    };

    if (autoPlay === "onMount") {
      start(true);
      return stop;
    }

    if (autoPlay === "manual") {
      if (playing) start(true);
      else stop();
      return stop;
    }

    // inView
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) start(replay);
          else stop();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, built, script.loop, replay, reduced, playing]);

  const frame: Frame = built.frames[Math.min(index, built.frames.length - 1)];
  return { frame, built, containerRef, reduced };
}
