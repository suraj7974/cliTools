"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CopyCommand } from "./CopyCommand";
import type { InstallOption } from "@/data/tools";

interface InstallTabsProps {
  options: InstallOption[];
  note?: string;
  idPrefix: string;
}

/** brew / cargo install tabs with a sliding accent underline. */
export function InstallTabs({ options, note, idPrefix }: InstallTabsProps) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Install methods"
        className="flex items-center gap-1 border-b border-[var(--line)]"
      >
        {options.map((opt, i) => (
          <button
            key={opt.label}
            role="tab"
            id={`${idPrefix}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${idPrefix}-panel-${i}`}
            onClick={() => setActive(i)}
            className={`relative px-4 py-2.5 font-mono text-[0.8125rem] ${
              i === active
                ? "text-[var(--ink)]"
                : "text-[var(--ink-faint)] hover:text-[var(--ink-soft)]"
            }`}
          >
            {opt.label}
            {i === active ? (
              <motion.span
                layoutId={`${idPrefix}-underline`}
                className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-[var(--accent)]"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            ) : null}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${idPrefix}-panel-${active}`}
        aria-labelledby={`${idPrefix}-tab-${active}`}
        className="pt-3"
      >
        <CopyCommand command={options[active].command} />
      </div>
      {note ? (
        <p className="mt-2.5">
          <span className="chip">{note}</span>
        </p>
      ) : null}
    </div>
  );
}
