# unbrowse-openclaw

Use Unbrowse inside OpenClaw.

This plugin adds a native `unbrowse` tool, teaches agents to use it first for website tasks, and gives you a strict mode that can keep agents off the built-in `browser` tool.

Use it when you want API-first web work: structured extraction, reverse-engineered site actions, less brittle browser automation.

## Install

```bash
openclaw plugins install unbrowse-openclaw
openclaw gateway restart
```

Verify:

```bash
openclaw plugins info unbrowse-browser
openclaw unbrowse-plugin health
```

If you use plugin allowlists, trust it:

```json5
{
  plugins: {
    allow: ["unbrowse-browser"]
  }
}
```

## What agents get

Tool:

```json
{
  "action": "resolve",
  "intent": "get pricing page API data",
  "url": "https://example.com"
}
```

Actions: `resolve`, `search`, `execute`, `login`, `skills`, `skill`, `health`

## Default web path

OpenClaw does not expose a true browser plugin slot, so this plugin does not replace the built-in `browser` tool by name.

### Fallback mode

Prefer Unbrowse first. Let `browser` handle real UI-only tasks.

- [examples/openclaw.fallback.json5](./examples/openclaw.fallback.json5)

### Strict mode

Route normal web tasks through Unbrowse by denying core `browser`.

- [examples/openclaw.strict.json5](./examples/openclaw.strict.json5)

Strict mode is the closest thing to making Unbrowse the default browser path in current OpenClaw.

## Tool policy

If you use tool allowlists, allow one of:

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

## Local dev install

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

## Dev

```bash
npm test
npm run typecheck
```
