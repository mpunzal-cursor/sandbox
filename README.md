# Cursor basics study guide

Interactive one-page checklist covering Cursor basics, Cloud Agents, and MCPs.

## Open the guide

Shareable live page:

- https://mpunzal-cursor.github.io/sandbox/
- https://mpunzal-cursor.github.io/sandbox/study-guide.html

If GitHub Pages is not live yet, open the file locally:

```bash
open study-guide.html
```

Or double-click `study-guide.html` / open it from Finder, Explorer, or your browser’s File menu. No server is required.

Checkboxes persist in this browser via `localStorage` (key `cursor-basics-study-guide-v1`) and survive refresh. Use **Reset progress** on the page to clear them.

## Share the study guide

1. Open the live page or `study-guide.html`.
2. Click **Copy share link**.
3. Send that HTTPS URL.

The copied link includes checkbox progress in the `?p=` query string, so a teammate sees the same checks. Section links (`#basics`, `#cloud`, `#mcp`) still work.

If Pages is not enabled, a repo admin should set **Settings → Pages → Source → GitHub Actions**. Until then, send `study-guide.html` as a file, or use this public preview of the current branch:

https://raw.githack.com/mpunzal-cursor/sandbox/cursor/cursor-basics-study-guide-406e/study-guide.html

## Share this Cloud Agent run

The guide URL and the Cloud Agent chat are different things.

1. Open the run on [cursor.com/agents](https://cursor.com/agents).
2. Copy the Cloud Agent run URL and send it.
3. The viewer must be on the same Cursor team, have source control connected under [Integrations](https://cursor.com/dashboard/integrations), and have access to this GitHub repository.

Team membership alone is not enough. Local IDE chats are not automatically visible. See [Share agents with your team](https://cursor.com/docs/cloud-agent.md#share-agents-with-your-team).

## Conventions

- Do not commit secrets (`.env`, credentials, shell history, etc.).
- If you open a PR for a Linear ticket, include `Resolves {ID}` in the PR body.
