export type Tone = "ink" | "green" | "cyan" | "yellow" | "comment";

export interface OutputSpan {
  text: string;
  tone?: Tone;
}

export interface OutputLine {
  spans: OutputSpan[];
}

/** One step of a terminal script. Scripts are pure data — the engine renders them. */
export type Step =
  | { kind: "prompt"; text?: string }
  | { kind: "type"; text: string; cps?: number }
  | { kind: "ghost"; text: string }
  | { kind: "accept" }
  | { kind: "key"; label: string }
  | { kind: "submit" }
  | { kind: "print"; lines: OutputLine[]; speed?: number }
  | { kind: "pause"; ms: number }
  | { kind: "clear" }
  | { kind: "confirm"; question: string; answer: string }
  | { kind: "marker"; id: string };

export interface TerminalScript {
  id: string;
  title?: string;
  prompt?: string;
  loop?: boolean;
  steps: Step[];
}

/* ---- rendered frame model ---- */

export interface FrameSpan {
  text: string;
  tone?: Tone;
  ghost?: boolean;
  flash?: boolean;
}

export interface FrameLine {
  prompt?: string;
  spans: FrameSpan[];
}

export interface Frame {
  t: number;
  lines: FrameLine[];
  typing: boolean;
  keycap: string | null;
  caret: boolean;
}

export interface BuiltScript {
  frames: Frame[];
  total: number;
  markers: Record<string, number>;
  maxLines: number;
}

/** Convenience for plain single-tone output lines. */
export function line(text: string, tone?: Tone): OutputLine {
  return { spans: [{ text, tone }] };
}
