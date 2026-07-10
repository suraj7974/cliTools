"use client";

import { useEffect, useRef } from "react";
import SplitType from "split-type";
import { gsap } from "@/lib/gsap";

const CHARSET = "abcdefghijklmnopqrstuvwxyz-_/{}[]<>$#";

interface ScrambleProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  play?: "mount" | "inView";
  /** "cascade" = smooth per-char fade; "decode" = fast random-char decode */
  mode?: "cascade" | "decode";
  delay?: number;
  /** per-character duration in ms */
  charDuration?: number;
  stagger?: number;
}

/**
 * Per-character text reveal. Cascade mode eases characters in smoothly;
 * decode mode flickers random characters before settling (terminal-style).
 * Server renders the final text (SEO, no CLS); animation is client-only.
 */
export function Scramble({
  text,
  as: Tag = "span",
  className = "",
  play = "inView",
  mode = "cascade",
  delay = 0,
  charDuration = 600,
  stagger = 18,
}: ScrambleProps) {
  const ref = useRef<HTMLElement | null>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let split: SplitType | null = null;
    let ctx: gsap.Context | null = null;

    const run = () => {
      if (done.current || !el) return;
      done.current = true;
      // split words AND chars: chars nest inside word spans, so lines can
      // only break between words — never mid-word
      split = new SplitType(el, { types: "words,chars" });
      const chars = split.chars ?? [];

      ctx = gsap.context(() => {
        if (mode === "decode") {
          // fast terminal-style decode: brief random flicker, then settle
          const dur = Math.min(charDuration, 380);
          chars.forEach((char, i) => {
            const finalChar = char.textContent ?? "";
            if (finalChar.trim() === "") return;
            const state = { p: 0 };
            gsap.fromTo(
              state,
              { p: 0 },
              {
                p: 1,
                duration: dur / 1000,
                delay: delay / 1000 + (i * Math.min(stagger, 14)) / 1000,
                ease: "none",
                onStart: () => {
                  char.style.opacity = "1";
                },
                onUpdate: () => {
                  char.textContent =
                    state.p < 0.7
                      ? CHARSET[Math.floor(Math.random() * CHARSET.length)]
                      : finalChar;
                },
                onComplete: () => {
                  char.textContent = finalChar;
                },
              },
            );
            char.style.opacity = "0";
          });
        } else {
          // smooth cascade
          gsap.fromTo(
            chars,
            { opacity: 0, filter: "blur(6px)", y: 6 },
            {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              duration: charDuration / 1000,
              delay: delay / 1000,
              ease: "power2.out",
              stagger: stagger / 1000,
              clearProps: "filter,transform",
            },
          );
        }
      }, el);
    };

    if (play === "mount") {
      run();
      return () => {
        ctx?.revert();
        split?.revert();
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      ctx?.revert();
      split?.revert();
    };
  }, [play, mode, delay, charDuration, stagger]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} aria-label={text}>
      {text}
    </Tag>
  );
}
