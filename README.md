# openclaw-unbrowse-plugin

Native OpenClaw plugin wrapper around the published `unbrowse` npm CLI.

## What this repo proves

`memory-lancedb-pro` uses the standard OpenClaw plugin shape:

- `openclaw.plugin.json` declares plugin id + config schema
- `package.json` uses `openclaw.extensions` to point at `index.ts`
- `index.ts` exports a plugin object with `id`, `name`, `description`, optional `kind`, and `register(api)`
- `register(api)` can add tools, CLI commands, hooks, services

This repo copies that packaging pattern, but for Unbrowse.

## Important constraint

OpenClaw does not expose a browser plugin slot. The built-in browser is a core tool backed by the browser proxy/node-host path. Plugin tools also cannot clash with core tool names.

So this plugin cannot replace the core `browser` tool by registering another `browser`.

Current viable path:

- register a first-class plugin tool: `unbrowse`
- inject bootstrap guidance telling agents to use `unbrowse` first for website tasks
- optionally deny core `browser` in tool policy for agents that should be Unbrowse-only
- allow fallback to core `browser` only for login, pixel checks, uploads, canvas, or when Unbrowse cannot discover an API path

This repo includes:

- dedicated bootstrap prompt template: [prompts/UNBROWSE_BROWSER.md](/Users/lekt9/Projects/unbrowse/submodules/openclaw-unbrowse-plugin/prompts/UNBROWSE_BROWSER.md)
- strict preset: [examples/openclaw.strict.json5](/Users/lekt9/Projects/unbrowse/submodules/openclaw-unbrowse-plugin/examples/openclaw.strict.json5)
- fallback preset: [examples/openclaw.fallback.json5](/Users/lekt9/Projects/unbrowse/submodules/openclaw-unbrowse-plugin/examples/openclaw.fallback.json5)

## Install

```bash
cd submodules/openclaw-unbrowse-plugin
npm install
openclaw plugins install .
openclaw plugins enable unbrowse-browser
```

Or load via config:

```json5
{
  plugins: {
    load: { paths: ["./submodules/openclaw-unbrowse-plugin"] },
    entries: {
      "unbrowse-browser": {
        enabled: true,
        config: {
          routingMode: "fallback",
          preferInBootstrap: true,
          allowBrowserFallback: true,
          timeoutMs: 120000
        }
      }
    }
  }
}
```

## Making it the default browser path

Recommended:

```json5
{
  tools: {
    allow: ["group:plugins", "unbrowse-browser", "unbrowse"],
    deny: ["browser"]
  },
  agents: {
    defaults: {
      tools: {}
    }
  }
}
```

Then allow the plugin tool through normal plugin tool policy. If you still want fallback, keep `browser` allowed and let the bootstrap guidance steer the model.

## Tool contract

Tool name: `unbrowse`

Main action for agents:

```json
{
  "action": "resolve",
  "intent": "get pricing page API data",
  "url": "https://example.com"
}
```

Supported actions:

- `resolve`
- `search`
- `execute`
- `login`
- `skills`
- `skill`
- `health`

## Dev

```bash
npm test
npm run typecheck
```

Useful helpers:

```bash
openclaw unbrowse-plugin health
openclaw unbrowse-plugin print-bootstrap
openclaw unbrowse-plugin print-config strict
openclaw unbrowse-plugin print-config fallback
```
