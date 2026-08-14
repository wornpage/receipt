import { describe, it, expect } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/WornReceipt.svelte", import.meta.url), "utf8");

describe("WornReceipt", () => {
  it("package name is correct", () => {
    const pkg = require("../package.json");
    expect(pkg.name).toBe("@wornpage/receipt");
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
});
