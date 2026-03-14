---
name: unbrowse-browser
description: Route website tasks through the Unbrowse-backed browser path instead of legacy pixel automation.
user-invocable: false
---

# Unbrowse Browser

Use this skill when website work should stay on the Unbrowse path instead of the legacy pixel browser.

Decision rule:
- Use `unbrowse` for website retrieval, extraction, authenticated reads, API discovery, and repeatable site actions.
- Use `browser` only for visual QA, drag/drop, canvas-heavy flows, uploads/downloads, or when Unbrowse reports no usable API path.

Default call shape:

```json
{
  "action": "resolve",
  "intent": "describe the website task in plain English",
  "url": "https://target-site.example"
}
```

Useful actions:
- `resolve`: discover and run the best API-backed path for a task on a URL
- `search`: search the shared Unbrowse marketplace for an existing skill
- `execute`: run a known `skillId` and `endpointId`
- `login`: bootstrap a manual login for later authenticated reads
- `skills`: inspect available marketplace skills
- `skill`: inspect one marketplace skill
- `health`: verify the local Unbrowse runtime

Execution notes:
- Keep `intent` concrete and outcome-based.
- Prefer structured API results over screenshots or selector work.
- Use `dryRun` before unsafe mutations.
- Use `confirmUnsafe` only with explicit user consent.
- If Unbrowse returns structured data, stay on the Unbrowse path instead of switching to legacy UI automation.
