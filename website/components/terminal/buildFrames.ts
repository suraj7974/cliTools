import type {
  BuiltScript,
  Frame,
  FrameLine,
  TerminalScript,
} from "./types";

/** Deterministic PRNG so builds are identical across renders (no hydration drift). */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function cloneLines(lines: FrameLine[]): FrameLine[] {
  return lines.map((l) => ({
    prompt: l.prompt,
    spans: l.spans.map((s) => ({ ...s })),
  }));
}

const KEYCAP_HOLD = 500;
const DEFAULT_CPS = 45;

/**
 * Compile a script into a deterministic timeline of frames.
 * State at any time t = the last frame with frame.t <= t — this single model
 * powers autoplay, loop, and scroll-scrubbed playback identically.
 */
export function buildFrames(script: TerminalScript): BuiltScript {
  const rand = mulberry32(hashString(script.id));
  const jitter = () => 0.7 + rand() * 0.6; // ±30%

  const frames: Frame[] = [];
  const markers: Record<string, number> = {};
  let lines: FrameLine[] = [];
  let t = 0;
  let keycap: string | null = null;
  let keycapClearAt = Infinity;
  let maxLines = 0;

  const push = (typing: boolean, caret = true) => {
    if (keycap !== null && t >= keycapClearAt) keycap = null;
    frames.push({ t, lines: cloneLines(lines), typing, keycap, caret });
    maxLines = Math.max(maxLines, lines.length);
  };

  const showKeycap = (label: string) => {
    keycap = label;
    keycapClearAt = t + KEYCAP_HOLD;
  };

  const clearKeycapFrame = () => {
    if (keycap !== null) {
      t = Math.max(t, keycapClearAt);
      keycap = null;
      push(false);
    }
  };

  const current = () => lines[lines.length - 1];

  // initial empty frame
  push(false, false);

  for (const step of script.steps) {
    switch (step.kind) {
      case "marker": {
        markers[step.id] = t;
        break;
      }
      case "prompt": {
        lines.push({ prompt: step.text ?? script.prompt ?? "❯ ", spans: [] });
        push(false);
        break;
      }
      case "type": {
        const cps = step.cps ?? DEFAULT_CPS;
        const lineRef = current();
        if (!lineRef) break;
        let span = lineRef.spans.find((s) => !s.ghost && !s.tone);
        if (!span) {
          span = { text: "" };
          // typed text always sits before any ghost suggestion
          const ghostIdx = lineRef.spans.findIndex((s) => s.ghost);
          if (ghostIdx === -1) lineRef.spans.push(span);
          else lineRef.spans.splice(ghostIdx, 0, span);
        }
        for (const ch of step.text) {
          t += (1000 / cps) * jitter();
          if (ch === " ") t += 55; // breath after words
          span.text += ch;
          push(true);
        }
        break;
      }
      case "ghost": {
        const lineRef = current();
        if (!lineRef) break;
        t += 150;
        const existing = lineRef.spans.find((s) => s.ghost);
        if (existing) existing.text = step.text; // suggestion narrows as you type
        else lineRef.spans.push({ text: step.text, ghost: true });
        push(false);
        break;
      }
      case "accept": {
        const lineRef = current();
        const ghost = lineRef?.spans.find((s) => s.ghost);
        if (!lineRef || !ghost) break;
        // flash: ghost turns accent + the → keycap pops
        t += 120;
        ghost.flash = true;
        showKeycap("→");
        push(false);
        // settle: ghost merges into solid typed text
        t += 180;
        ghost.ghost = false;
        ghost.flash = false;
        push(false);
        clearKeycapFrame();
        break;
      }
      case "key": {
        t += 100;
        showKeycap(step.label);
        push(false);
        clearKeycapFrame();
        break;
      }
      case "submit": {
        t += 140;
        push(false, false);
        break;
      }
      case "print": {
        const speed = step.speed ?? 90;
        for (const out of step.lines) {
          t += speed;
          lines.push({ spans: out.spans.map((s) => ({ ...s })) });
          push(false, false);
        }
        break;
      }
      case "pause": {
        t += step.ms;
        push(false);
        break;
      }
      case "clear": {
        t += 60;
        lines = [];
        push(false, false);
        break;
      }
      case "confirm": {
        t += 220;
        lines.push({ spans: [{ text: step.question, tone: "yellow" }] });
        push(false, false);
        t += 650;
        showKeycap(step.answer);
        push(false, false);
        t += 350;
        current()?.spans.push({ text: ` ${step.answer}` });
        push(false, false);
        clearKeycapFrame();
        break;
      }
    }
  }

  // final settle frame
  t += 200;
  keycap = null;
  push(false);

  return { frames, total: t, markers, maxLines: Math.max(maxLines, 1) };
}

/** Frame index for a given time — binary search over the built timeline. */
export function frameIndexAt(built: BuiltScript, time: number): number {
  const { frames } = built;
  let lo = 0;
  let hi = frames.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (frames[mid].t <= time) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}
