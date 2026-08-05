# Cursor basics learning guide

Learn current Cursor surfaces in place: desktop Agent, Cloud Agents, and MCP. August 2026.

**Agent chat (share this with your manager):** https://cursor.com/agents/bc-74e6217f-62e8-414b-b188-b8d2cf27406e

A viewer needs the same Cursor team, their own GitHub connected at https://cursor.com/dashboard/integrations, and access to this repo. Team membership alone is not enough. Docs: https://cursor.com/docs/cloud-agent.md#share-agents-with-your-team

Use Notion checkboxes for progress. Open each toggle to learn the topic. Official Cursor videos are embedded as links you can preview in Notion.

---

## 1. Cursor basics

### What Cursor is

Cursor is a desktop AI code editor whose main product surface is **Agent**. You also run the same agent loop as Cloud Agents on the web and mobile.

Three layers:

- **Editor** — open a folder, edit files, use Tab and inline edit.
- **Agent** — a goal-driven loop with tools: search, edit, terminal, browser, and more.
- **Cloud Agents** — the same loop on an isolated VM.

Composer 2.5 is a *model* in the model picker. Agent is the product surface. Do not confuse Composer 2.5 with the old Composer UI.

**Try it:** Open Cursor on any repo. You should see the editor plus an Agent input.

**Official video:** [Introducing Cursor 3](https://www.youtube.com/watch?v=UxbULt_hCdA)

### Open a folder and start Agent

Agent, project rules, skills, and project MCP config are scoped to the folder you opened.

1. File → Open Folder.
2. Press `Cmd+I` (Mac) or `Ctrl+I` (Windows/Linux).
3. Type a specific task and press Return.

Example prompt:

```
Add a settings page that matches src/pages/Profile.tsx.
Include display name, email notification toggle, and theme dropdown.
Reuse existing form components. Do not introduce a new UI library.
```

Watch diffs. Use Stop to interrupt. Restore a checkpoint if the agent went the wrong way. Checkpoints are local snapshots, not Git.

**Official video:** [Agent View & CLI setup](https://www.youtube.com/shorts/DpMOt9wiEzM)

### How Agent mode works

Agent searches the codebase, edits files, runs terminal commands, and iterates. It is an agent harness:

1. **Instructions** — system prompt plus your rules.
2. **Tools** — read/search, edit, shell, browser, web, and more.
3. **Model** — the model you pick (or Auto / Cursor Router).

Queue follow-ups with Enter while it works. Send immediately with `Cmd/Ctrl+Enter`. Start a new chat when the task changes.

**Try it:** Ask Agent to add a failing test for one existing function, run tests, then make only that test pass.

**Official video:** [How Cursor uses Cursor](https://www.youtube.com/watch?v=kcBt3cuZAhI)

### Agent, Ask, Plan, and Debug

Cycle modes with `Shift+Tab`.

- **Agent** — default. Edits and runs commands.
- **Ask** — read-only explanations.
- **Plan** — researches, asks questions, writes a plan. Click **Build** after you approve it.
- **Debug** — tricky bugs that need runtime evidence.

Rules apply in all four modes. They do not apply to Tab or inline edit.

**Try it:** Switch to Plan, request a notification-preferences feature, edit one milestone, then Build.

### Tab autocomplete

Tab is next-edit prediction as you type, not the Agent panel.

- Accept all: `Tab`
- Reject: `Esc`
- Word by word: `Cmd/Ctrl+→`
- After accept, `Tab` again can jump to the next edit location.

### Inline edit with Cmd/Ctrl+K

Select code → `Cmd/Ctrl+K` → describe the change → Return. User rules do not apply. Escalate to Agent with `Cmd/Ctrl+L`.

### @ mentions and context

Type `@` to attach files/folders, terminals, git diffs, browser context, or past chats. If you are unsure which file matters, skip `@` and let Agent search.

### Rules and AGENTS.md

Precedence: **Team → Project → User**.

- Project rules: `.cursor/rules/*.mdc`
- User rules: Customize → Rules
- Team rules: dashboard (Teams/Enterprise)
- `AGENTS.md`: plain markdown in the repo or nested folders

Create with `/create-rule` or Customize → Rules.

### Skills (SKILL.md)

Portable workflows in `.cursor/skills/` (and related folders). Agent loads them when relevant, or invoke with `/`.

**Try it:** Run `/create-skill` and make a skill that runs your repo lint command.

### Models picker and Composer 2.5

Pick a model in the Agent input (`Cmd/Ctrl+/` to cycle). Mode and model are independent. Composer 2.5 is Cursor’s agentic coding *model*, not the old Composer UI.

### Privacy Mode for teams

Privacy Mode is on by default for teams (no training on your code). Legacy **No Storage** blocks Cloud Agents and Shared Transcripts. Use standard Privacy Mode if you need cloud runs.

---

## 2. Cloud Agents

### Isolated cloud VMs, not your laptop

Formerly Background Agents. Each run gets an isolated VM. Your laptop does not need to stay online. Local Agent edits on your machine; Cloud Agents push branches/PRs, produce artifacts, and share via run URLs.

**Official videos:**

- [Cursor Cloud Agents](https://www.youtube.com/watch?v=0JsmvKps9po)
- [Testing in a live VM](https://www.youtube.com/shorts/tZGaZVbxISc)

### Start and review a Cloud Agent

Admin must connect source control first. Then start from:

- https://cursor.com/agents
- Desktop Agent dropdown → **Cloud**
- iOS app / Android PWA
- Slack or Linear `@cursor`
- GitHub PR/issue or Bitbucket PR comment `@cursor`
- API

Review conversation, diffs, artifacts, optional remote desktop, and the PR.

**Official video:** [Cloud agent building a small game](https://www.youtube.com/shorts/G044GBwgcKA)

### Share runs vs Shared Transcripts

Send the Cloud Agent run URL. Viewer needs:

1. Same Cursor team
2. Own SCM connected at https://cursor.com/dashboard/integrations
3. Access to the repo

Default view is read-only. **Shared Transcripts** (`cursor.com/s/…`) are a different, Teams+ feature for local chats.

**This run:** https://cursor.com/agents/bc-74e6217f-62e8-414b-b188-b8d2cf27406e

---

## 3. MCP (Model Context Protocol)

### What MCP is and how to add it locally

MCP lets Agent call external tools (Linear, Notion, DBs, APIs).

Add locally via **Customize → MCPs** / marketplace, or:

- Project: `.cursor/mcp.json`
- User: `~/.cursor/mcp.json`

Do not hardcode secrets in git. Use `${env:NAME}`, dashboard secrets, or OAuth.

**Try it:** Install one trusted marketplace MCP and ask Agent to use a named tool.

### Team MCP, Cloud MCP, and security

Three separate paths:

- Dashboard **Integrations & MCP** → Cloud Agents
- Git `mcp.json` → local clones
- Marketplace / Customize install → separate action

Cloud Agents: **HTTP preferred**, stdio also works. **SSE and `mcp-remote` are not supported.** OAuth is per-user.

**Official video:** [Cursor Agent SDK](https://www.youtube.com/watch?v=doUzFbTdYQ8)

---

## Official docs

- https://cursor.com/docs/agent/overview
- https://cursor.com/help/ai-features/agent
- https://cursor.com/learn/working-with-agents
- https://cursor.com/docs/cloud-agent
- https://cursor.com/docs/mcp
- https://cursor.com/docs/rules
- https://cursor.com/docs/skills
- https://cursor.com/help/ai-features/shared-transcripts
