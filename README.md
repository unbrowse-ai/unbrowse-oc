# unbrowse-openclaw

OpenClaw plugin that makes Unbrowse the preferred tool for website tasks.

It adds:

- agent tool: `unbrowse`
- bootstrap guidance that tells agents to use Unbrowse first
- config presets for `fallback` and `strict` routing
- small CLI helpers for debugging

Use it when you want agents to hit APIs and structured data paths before reaching for pixel browser automation.

## Install

Intended npm package:

```bash
@lekt9/unbrowse-openclaw
```

Until that scope is published, install from a local checkout:

```bash
git clone https://github.com/lekt9/unbrowse-openclaw.git
cd unbrowse-openclaw
npm install
openclaw plugins install .
openclaw gateway restart
```

Verify:

```bash
openclaw plugins info unbrowse-browser
openclaw unbrowse-plugin health
```

If you use plugin allowlists, trust it explicitly:

```json5
{
  plugins: {
    allow: ["unbrowse-browser"]
  }
}
```

## What agents get

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

## Make Unbrowse the default web path

OpenClaw does not expose a true browser plugin slot, so this plugin does not replace the built-in `browser` tool by name.

What it does instead:

- adds the `unbrowse` tool
- injects prompt guidance so agents prefer it
- lets you deny core `browser` in tool policy when you want strict routing

### Fallback mode

Prefer Unbrowse first, but still allow core `browser` when the task really needs UI automation.

- [examples/openclaw.fallback.json5](./examples/openclaw.fallback.json5)

### Strict mode

Force normal web tasks onto Unbrowse by denying core `browser`.

- [examples/openclaw.strict.json5](./examples/openclaw.strict.json5)

Strict mode is the closest thing to “make Unbrowse the default browser” in current OpenClaw.

## Tool policy

If you use tool allowlists, include one of:

- plugin id: `unbrowse-browser`
- tool name: `unbrowse`
- `group:plugins`

Example:

```json5
{
  tools: {
    allow: ["group:plugins", "unbrowse-browser", "unbrowse"]
  }
}
```

## Local dev

Load directly from source with `plugins.load.paths`:

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
