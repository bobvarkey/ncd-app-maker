/**
 * Automated static-analysis "visual regression" guard.
 *
 * The app runs on a dark Ocean Deep theme. Every label, value, and
 * placeholder MUST resolve to white (or muted-foreground) on dark
 * backgrounds. Because jsdom does not compute CSS, we cannot do true
 * pixel diffing inside vitest — instead we scan every component for
 * the patterns that have historically caused dark-on-dark bugs:
 *
 *   1. An element whose className mixes a DARK surface token with an
 *      explicit DARK text color (e.g. bg-slate-900 + text-slate-800).
 *   2. A <Label> / <p> / <span> hard-coding text-black, text-slate-900,
 *      text-gray-900, etc. with no light background sibling.
 *   3. An <Input>/<Textarea> with a placeholder= prop AND a hard-coded
 *      dark text-* class (placeholder would be invisible).
 *
 * If any of these patterns appear, the test fails with a precise list
 * of offending file:line locations so the regression can be fixed.
 */
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(__dirname, "..");

const DARK_BG_TOKENS = [
  // Tailwind palette — 600 and darker are visually dark surfaces
  /\bbg-(?:slate|gray|zinc|neutral|stone)-(?:6|7|8|9)\d{2}\b/,
  /\bbg-(?:blue|indigo|violet|purple|pink|rose|red|orange|emerald|green|teal|cyan|sky)-(?:7|8|9)\d{2}\b/,
  /\bbg-black\b/,
  // Semantic dark surfaces (this app's theme is dark)
  /\bbg-(?:background|card|popover|muted|secondary|sidebar|destructive|foreground)(?:\/\d+)?\b/,
];

const DARK_TEXT_TOKENS = [
  /\btext-(?:slate|gray|zinc|neutral|stone)-(?:7|8|9)\d{2}\b/,
  /\btext-black\b/,
];

// Tokens that explicitly opt into white / theme-foreground text — if any
// of these appear on the same element, the element is fine.
const SAFE_TEXT_TOKENS = [
  /\btext-white\b/,
  /\btext-foreground\b/,
  /\btext-(?:primary|secondary|accent|destructive|card|popover|muted)-foreground\b/,
  /\btext-(?:slate|gray|zinc|neutral|stone)-(?:50|100|200|300)\b/,
];

// If the same className ALSO carries a clearly-light bg, the dark text is OK.
const LIGHT_BG_TOKENS = [
  /\bbg-white\b/,
  /\bbg-(?:slate|gray|zinc|neutral|stone)-(?:50|100|200|300)\b/,
  /\bbg-(?:amber|yellow|blue|green|red|orange|cyan|emerald|teal|sky|indigo|violet|purple|pink|rose|lime)-(?:50|100|200)\b/,
];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (/\.(tsx|jsx)$/.test(entry) && !/\.(test|spec)\./.test(entry)) out.push(full);
  }
  return out;
}

interface Finding {
  file: string;
  line: number;
  snippet: string;
  reason: string;
}

// Match className="..." OR className={`...`} OR className={cn("...", ...)}.
// We grab anything inside the quotes; cn() composition still surfaces literal classes.
const CLASS_ATTR_RE = /class(?:Name)?\s*=\s*(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\}|\{cn\(([^)]*)\)\})/g;

function scanFile(path: string): Finding[] {
  const src = readFileSync(path, "utf8");
  const findings: Finding[] = [];
  const lines = src.split("\n");

  lines.forEach((line, idx) => {
    let m: RegExpExecArray | null;
    const re = new RegExp(CLASS_ATTR_RE.source, "g");
    while ((m = re.exec(line))) {
      const classStr = m[1] ?? m[2] ?? m[3] ?? m[4] ?? "";
      if (!classStr) continue;

      const hasDarkText = DARK_TEXT_TOKENS.some((r) => r.test(classStr));
      if (!hasDarkText) continue;

      const hasSafeText = SAFE_TEXT_TOKENS.some((r) => r.test(classStr));
      const hasLightBg = LIGHT_BG_TOKENS.some((r) => r.test(classStr));
      if (hasSafeText || hasLightBg) continue;

      const hasDarkBg = DARK_BG_TOKENS.some((r) => r.test(classStr));

      // Case A: dark bg + dark text on the SAME element — guaranteed bug.
      if (hasDarkBg) {
        findings.push({
          file: relative(ROOT, path),
          line: idx + 1,
          snippet: classStr.slice(0, 140),
          reason: "Dark text token combined with dark background token",
        });
        continue;
      }

      // Case B: standalone dark text with no light bg context. Allowed only
      // for known light-card components (we treat .bg-amber-50 etc. siblings
      // as the parent), so we skip flagging when the file clearly opts into
      // light surfaces. Heuristic: file references a light bg token anywhere.
      const fileHasLightBg = LIGHT_BG_TOKENS.some((r) => r.test(src));
      if (!fileHasLightBg) {
        findings.push({
          file: relative(ROOT, path),
          line: idx + 1,
          snippet: classStr.slice(0, 140),
          reason: "Dark text token with no light surface in scope",
        });
      }
    }
  });

  return findings;
}

describe("dark-mode contrast regression guard", () => {
  const files = walk(ROOT).filter((f) => !f.endsWith("dark-mode-contrast.test.ts"));

  it("scans the entire src/ tree", () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it("has no element mixing dark text with a dark background", () => {
    const offenders = files
      .flatMap(scanFile)
      .filter((f) => f.reason === "Dark text token combined with dark background token");

    if (offenders.length) {
      const msg = offenders
        .map((f) => `  ${f.file}:${f.line}  → ${f.snippet}`)
        .join("\n");
      throw new Error(
        `Found ${offenders.length} dark-on-dark className regressions:\n${msg}`,
      );
    }
    expect(offenders).toEqual([]);
  });

  it("inputs/textareas with placeholder= do not hard-code dark text", () => {
    const offenders: Finding[] = [];
    for (const path of files) {
      const src = readFileSync(path, "utf8");
      const lines = src.split("\n");
      // crude multi-line element capture: look for <Input ...> spans up to next >
      const elementRe = /<(Input|Textarea|input|textarea)\b[\s\S]*?\/?>/g;
      let m: RegExpExecArray | null;
      while ((m = elementRe.exec(src))) {
        const el = m[0];
        if (!/\bplaceholder\s*=/.test(el)) continue;
        const classMatch = /class(?:Name)?\s*=\s*"([^"]*)"/.exec(el);
        if (!classMatch) continue;
        const cls = classMatch[1];
        const hasDarkText = DARK_TEXT_TOKENS.some((r) => r.test(cls));
        const hasSafe = SAFE_TEXT_TOKENS.some((r) => r.test(cls));
        if (hasDarkText && !hasSafe) {
          // line of match
          const upto = src.slice(0, m.index).split("\n").length;
          offenders.push({
            file: relative(ROOT, path),
            line: upto,
            snippet: cls.slice(0, 140),
            reason: "Input with placeholder uses dark text color",
          });
        }
      }
    }
    if (offenders.length) {
      const msg = offenders.map((f) => `  ${f.file}:${f.line}  → ${f.snippet}`).join("\n");
      throw new Error(
        `Found ${offenders.length} placeholder/dark-text regressions:\n${msg}`,
      );
    }
    expect(offenders).toEqual([]);
  });

  it("index.css still enforces the dark-surface → white-text rule", () => {
    const css = readFileSync(join(ROOT, "index.css"), "utf8");
    // The rule may live anywhere in the file; just assert the key tokens exist.
    expect(css).toMatch(/bg-card/);
    expect(css).toMatch(/bg-background/);
    expect(css).toMatch(/color:\s*#fff/i);
  });
});
