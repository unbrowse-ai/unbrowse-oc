import test from "node:test";
import assert from "node:assert/strict";

test("exports plugin metadata", async () => {
  const mod = await import("../index.ts");
  const plugin = mod.default as { id?: string; name?: string; register?: unknown };

  assert.equal(plugin.id, "unbrowse-browser");
  assert.equal(plugin.name, "Unbrowse Browser");
  assert.equal(typeof plugin.register, "function");
});

test("strict mode bootstrap guide forbids browser fallback", async () => {
  const mod = await import("../index.ts");
  const guide = mod.__test.buildBootstrapGuide(mod.__test.normalizeConfig({ routingMode: "strict" }));

  assert.match(guide, /strict mode/i);
  assert.match(guide, /Do not use the core `browser` tool/);
});

test("fallback mode config keeps browser available", async () => {
  const mod = await import("../index.ts");
  const snippet = mod.__test.buildSuggestedConfig("fallback");

  assert.match(snippet, /"unbrowse-browser"/);
  assert.doesNotMatch(snippet, /deny: \["browser"\]/);
});

test("resolve action maps to unbrowse CLI args", async () => {
  const mod = await import("../index.ts");
  const args = mod.__test.buildArgs({
    action: "resolve",
    intent: "get prices",
    url: "https://example.com",
    path: "data.items[]",
    extract: "title,price",
    limit: 5,
    dryRun: true,
  });

  assert.deepEqual(args, [
    "resolve",
    "--intent",
    "get prices",
    "--url",
    "https://example.com",
    "--path",
    "data.items[]",
    "--extract",
    "title,price",
    "--limit",
    "5",
    "--dry-run",
  ]);
});
