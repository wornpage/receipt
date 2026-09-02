import { describe, it, expect } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/WornReceipt.svelte", import.meta.url), "utf8");
const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");

describe("WornReceipt", () => {
  it("package name is correct", () => {
    const pkg = require("../package.json");
    expect(pkg.name).toBe("@wornpage/receipt");
    expect(pkg.version).toBe("0.1.6");
  });

  it("pins the exact shared button commit", () => {
    const pkg = require("../package.json");
    expect(pkg.dependencies["@wornpage/button"]).toBe(
      "https://codeload.github.com/wornpage/button/tar.gz/ade0d9cb63830d7ae1f19b74d240e33a68c00a00",
    );
  });

  it("exports WornReceipt from index", async () => {
    const mod = await import("../src/index.ts");
    expect(mod.WornReceipt).toBeDefined();
  });

  it("WornReceipt component is importable", async () => {
    // Component imports should resolve without error
    const mod = await import("../src/WornReceipt.svelte");
    expect(mod.default).toBeDefined();
  });

  it("has correct peer dependencies", () => {
    const pkg = require("../package.json");
    expect(pkg.peerDependencies.svelte).toBeDefined();
  });

  it("has MIT license", () => {
    const pkg = require("../package.json");
    expect(pkg.license).toBe("MIT");
  });

  it("exports map includes types and svelte conditions", () => {
    const pkg = require("../package.json");
    expect(pkg.exports["."].svelte).toBeDefined();
    expect(pkg.exports["."].types).toBeDefined();
  });

  it("renders only actions backed by handlers through the shared button", () => {
    expect(source).toContain("import { Button } from '@wornpage/button';");
    expect(source).toContain("{#if (undoAvailable && onundo) || ondone}");
    expect(source).toContain("{#if undoAvailable && onundo}");
    expect(source).toContain("{#if ondone}<Button size=\"sm\" onclick={ondone}>Dismiss</Button>{/if}");
    expect(source).not.toContain("class=\"worn-btn\"");
  });

  it("honors reduced motion and contains long result text", () => {
    expect(source).toContain("import { prefersReducedMotion } from 'svelte/motion';");
    expect(source).toContain("duration: prefersReducedMotion.current ? 0 : 220");
    expect(source).toContain("overflow-wrap: anywhere;");
    expect(source).toContain("flex-wrap: wrap;");
  });

  it("announces standalone receipts by default and supports one app-owned live region", () => {
    expect(source).toContain("announce?: boolean;");
    expect(source).toContain("announce = true");
    expect(source).toContain("role={announce ? 'status' : undefined}");
    expect(source).toContain("aria-live={announce ? 'polite' : undefined}");
    expect(source).toContain("aria-atomic={announce ? 'true' : undefined}");
  });

	it("owns its programmatic focus target and theme-extensible outline", () => {
		const focusRule = source.match(/\.worn-receipt:focus-visible \{[\s\S]*?\}/u)?.[0] ?? "";
		expect(source).toMatch(/<div\s+class="worn-receipt"[\s\S]*?tabindex="-1"/u);
		expect(focusRule).toContain("outline: 2px dashed var(--worn-receipt-focus, var(--worn-focus, var(--worn-text, currentColor)));");
		expect(focusRule).not.toContain("--worn-accent");
		expect(readme).toContain("`--worn-receipt-focus`");
	});
});
