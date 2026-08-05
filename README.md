# Cursor basics learning guide

Interactive one-page learning guide covering Cursor basics, Cloud Agents, and MCPs. Lessons stay on the page; official Cursor videos load inside topic dropdowns.

## Open or share the guide

Live page (no clone required):

https://raw.githack.com/mpunzal-cursor/sandbox/cursor/cursor-basics-study-guide-406e/study-guide.html

After merge, the same file on `main` is:

https://raw.githack.com/mpunzal-cursor/sandbox/main/study-guide.html

First-party GitHub Pages URL, once enabled under **Settings → Pages → Source → GitHub Actions**:

- https://mpunzal-cursor.github.io/sandbox/
- https://mpunzal-cursor.github.io/sandbox/study-guide.html

To open a local copy:

```bash
open study-guide.html
```

Or double-click `study-guide.html`. No server is required for the lessons. Opening a topic loads official videos from YouTube when you are online.

## Progress markers

Click the square next to a topic:

1. Green check = learned
2. Red X = skipped / not needed
3. Third click = clear

Progress is stored in this browser via `localStorage` (`cursor-basics-study-guide-v2`) and survives refresh. **Copy share link** includes checks and skips in `?p=`. **Reset progress** clears local state.

## Share this Cloud Agent run

The guide URL and the Cloud Agent chat are different things.

1. Open the run on [cursor.com/agents](https://cursor.com/agents).
2. Copy the Cloud Agent run URL and send it.
3. The viewer must be on the same Cursor team, have source control connected under [Integrations](https://cursor.com/dashboard/integrations), and have access to this GitHub repository.

Team membership alone is not enough. Local IDE chats are not automatically visible. See [Share agents with your team](https://cursor.com/docs/cloud-agent.md#share-agents-with-your-team).

## Conventions

- Do not commit secrets (`.env`, credentials, shell history, etc.).
- If you open a PR for a Linear ticket, include `Resolves {ID}` in the PR body.
