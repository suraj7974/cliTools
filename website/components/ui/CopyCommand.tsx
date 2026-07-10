"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface CopyCommandProps {
  command: string;
  className?: string;
  /** compact chips omit the surrounding mini-terminal styling */
  bare?: boolean;
}

/** A command with a copy button that morphs to a confirmation. */
export function CopyCommand({
  command,
  className = "",
  bare = false,
}: CopyCommandProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      className={`flex items-center justify-between gap-3 ${
        bare
          ? ""
          : "rounded-[0.625rem] border border-[var(--term-line)] bg-[var(--term-bg)] py-2.5 pl-4 pr-2"
      } ${className}`}
    >
      <code className="min-w-0 flex-1 truncate font-mono text-[0.8125rem] text-[var(--term-ink)]">
        <span className="term__prompt">❯ </span>
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className="relative shrink-0 rounded-md border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.06)] px-2.5 py-1.5 font-mono text-[0.6875rem] text-[#a6adb8] hover:border-[rgba(255,255,255,0.32)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "ok" : "copy"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className={copied ? "text-[var(--term-green)]" : ""}
            style={{ display: "inline-block" }}
          >
            {copied ? "✓ copied" : "copy"}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
