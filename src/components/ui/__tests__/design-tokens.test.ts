import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

// Regression tripwire: custom --spacing-<name> tokens hijack Tailwind v4 utilities.
// Defining --spacing-lg made `max-w-lg` resolve to 32px site-wide (2026-08-26 incident).
// Ban named spacing tokens that collide with the container scale (xs, sm, md, lg, xl...).
const BANNED = ["xs", "sm", "md", "lg", "xl", "2xl"];

describe("design tokens", () => {
  const css = readFileSync(join(__dirname, "../../../app/globals.css"), "utf-8");

  it("does not define named --spacing tokens that hijack max-w-* utilities", () => {
    const offenders = BANNED.filter((name) =>
      new RegExp(`--spacing-${name}\\s*:`, "m").test(css)
    );
    expect(offenders).toEqual([]);
  });
});
