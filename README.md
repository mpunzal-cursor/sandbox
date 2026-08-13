# Cursor basics learning guide

Interactive local HTML lessons plus a Notion-ready copy for sharing. Covers Cursor basics, Cloud Agents, and MCPs.

## Share in Notion (preferred)

Do **not** use githack or other third-party HTML hosts.

Installing the Notion MCP for the team is not enough for this Cloud Agent. OAuth is **per-user** and must be completed for the run:

1. Open https://cursor.com/agents/bc-74e6217f-62e8-414b-b188-b8d2cf27406e
2. Use the **MCP** dropdown on that run and sign in to Notion (Approve access to the pages/workspace where the guide should live).
3. Send a follow-up in this chat so the agent can create the live Notion page.

Manual fallback if you do not want to wait on MCP:

1. Import [`study-guide.notion.md`](study-guide.notion.md) into Notion (**Import → Markdown**).
2. Convert topic headings to toggles if needed.
3. Share the Notion page with your manager.
4. Paste the Notion URL into `NOTION_URL` in `study-guide.html`.

## Open locally (interactive markers)

```bash
open study-guide.html
```

Marker clicks: blank → green check → red X → blank. Progress is stored in this browser (`cursor-basics-study-guide-v2`). Videos load from YouTube only after you open a topic.

## Share this Cloud Agent run

Chat URL:

https://cursor.com/agents/bc-74e6217f-62e8-414b-b188-b8d2cf27406e

This run is **team-visible**. A viewer still needs:

1. The same Cursor team as the run owner (Mark Punzal).
2. Their own GitHub connected at [Integrations](https://cursor.com/dashboard/integrations).
3. Access to [github.com/mpunzal-cursor/sandbox](https://github.com/mpunzal-cursor/sandbox) (this repo is **public**, so GitHub read access is open).

Team membership alone is not enough. Default view is read-only. See [Share agents with your team](https://cursor.com/docs/cloud-agent.md#share-agents-with-your-team).

## Conventions

- Do not commit secrets (`.env`, credentials, shell history, etc.).
- If you open a PR for a Linear ticket, include `Resolves {ID}` in the PR body.
