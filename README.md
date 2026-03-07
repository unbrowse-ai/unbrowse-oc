# unbrowse-openclaw

Native OpenClaw plugin that adds an `unbrowse` agent tool backed by the `unbrowse` npm CLI.

## What it does

The plugin uses the normal OpenClaw plugin pack shape:

- `openclaw.plugin.json` declares plugin id + config schema
- `package.json` uses `openclaw.extensions` to point at `index.ts`
- `index.ts` exports a plugin object with `id`, `name`, and `register(api)`

At runtime it provides:

- agent tool: `unbrowse`
- bootstrap guidance injected during `agent:bootstrap`
- CLI helpers under `openclaw unbrowse-plugin ...`
- startup healthcheck service

## Important constraint

OpenClaw does not expose a browser plugin slot. The built-in `browser` tool is core OpenClaw functionality, and plugin tools must not clash with core tool names.

So this plugin does **not** replace the core `browser` tool by name. Instead it makes Unbrowse the preferred path for website tasks by combining:

- a first-class plugin tool: `unbrowse`
- injected bootstrap guidance
- optional tool policy that denies core `browser`

## Install

OpenClaw supports plugin install from a local path or an npm spec. GitHub URLs are not accepted directly by `openclaw plugins install`, so clone the repo first.

### 1. Clone the repo

```bash
git clone https://github.com/lekt9/unbrowse-openclaw.git
cd unbrowse-openclaw
npm install
```

### 2. Install into OpenClaw

```bash
openclaw plugins install .
```

OpenClaw installs the plugin in-process and enables installed plugins by default.

### 3. Restart the gateway

```bash
openclaw gateway restart
```

OpenClaw’s plugin docs note that config changes require a gateway restart.

### 4. Verify the plugin

```bash
openclaw plugins info unbrowse-browser
openclaw unbrowse-plugin health
```

Useful diagnostics:

```bash
openclaw plugins list
openclaw plugins doctor
```

## Configure it via `plugins.load.paths`

If you prefer to keep the plugin checked out and loaded from source rather than using `openclaw plugins install`, OpenClaw supports discovery via `plugins.load.paths`.

```json5
{
  plugins: {
    allow: ["unbrowse-browser"],
    load: { paths: ["/absolute/path/to/unbrowse-openclaw"] },
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

Then restart the gateway:

```bash
openclaw gateway restart
```

`plugins.allow` is recommended so OpenClaw trusts this plugin explicitly and does not warn about non-bundled plugin discovery.

## Tool policy

OpenClaw plugin tools are exposed to agents through normal tool policy. If you use allowlists, include either:

- the plugin id: `unbrowse-browser`
- the tool name: `unbrowse`
- or `group:plugins`

Example:

```json5
{
  tools: {
    allow: ["group:plugins", "unbrowse-browser", "unbrowse"]
  }
}
```

## Make Unbrowse the default web path

### Fallback mode

Fallback mode prefers Unbrowse first but still allows the core `browser` tool when the task truly needs browser automation.

Use the preset:

- [examples/openclaw.fallback.json5](/Users/lekt9/Projects/unbrowse/submodules/openclaw-unbrowse-plugin/examples/openclaw.fallback.json5)

Or:

```json5
{
  plugins: {
    entries: {
      "unbrowse-browser": {
        enabled: true,
        config: {
          routingMode: "fallback",
          preferInBootstrap: true,
          timeoutMs: 120000
        }
      }
    }
  },
  tools: {
    allow: ["group:plugins", "unbrowse-browser", "unbrowse"]
  }
}
```

### Strict mode

Strict mode is the closest thing to “default browser = Unbrowse” in current OpenClaw. It denies the core `browser` tool and pushes agents onto `unbrowse`.

Use the preset:

- [examples/openclaw.strict.json5](/Users/lekt9/Projects/unbrowse/submodules/openclaw-unbrowse-plugin/examples/openclaw.strict.json5)

Or:

```json5
{
  plugins: {
    entries: {
      "unbrowse-browser": {
        enabled: true,
        config: {
          routingMode: "strict",
          preferInBootstrap: true,
          timeoutMs: 120000
        }
      }
    }
  },
  tools: {
    allow: ["group:plugins", "unbrowse-browser", "unbrowse"],
    deny: ["browser"]
  }
}
```

## Agent usage

Tool name:

- `unbrowse`

Typical call:

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

The bootstrap prompt used by the plugin lives at [prompts/UNBROWSE_BROWSER.md](/Users/lekt9/Projects/unbrowse/submodules/openclaw-unbrowse-plugin/prompts/UNBROWSE_BROWSER.md).

## CLI helpers

```bash
openclaw unbrowse-plugin health
openclaw unbrowse-plugin print-bootstrap
openclaw unbrowse-plugin print-config strict
openclaw unbrowse-plugin print-config fallback
```

## Development

```bash
npm test
npm run typecheck
```
