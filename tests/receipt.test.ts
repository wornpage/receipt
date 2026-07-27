import { describe, it, expect } from "bun:test";

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
});