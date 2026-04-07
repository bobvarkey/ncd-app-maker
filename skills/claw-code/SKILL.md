---
name: claw-code
description: 'Delegate coding tasks to the Claw Code Rust CLI agent (ultraworkers/claw-code). Use when: (1) building/creating new features or apps, (2) reviewing PRs (spawn in temp dir), (3) refactoring large codebases, (4) iterative coding that needs file exploration. Binary: ~/.local/bin/claw-code (built from https://github.com/ultraworkers/claw-code). USES MINIMAX by default — no separate Anthropic key needed.'
metadata:
  {
    "openclaw":
      {
        "emoji": " 🦴",
        "requires": { "anyBins": ["claw-code"] },
      },
  }
---

# Claw Code — Rust CLI Coding Agent

A fast Rust reimplementation of the claw CLI agent harness (~20K LOC, 9 crates). Slots into OpenClaw alongside Codex/Claude Code.

## ✅ Uses MiniMax by default (no separate Anthropic key!)

Claw Code routes through MiniMax's Anthropic-compatible endpoint:

| Env var | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Your MiniMax API key (same one OpenClaw uses) |
| `ANTHROPIC_BASE_URL` | `https://api.minimax.io/anthropic` |

Your existing MiniMax key is already in `~/.openclaw/openclaw.json`.

⚠️ **Model names:** Claw Code's `opus`/`sonnet`/`haiku` aliases map to Claude model names. For MiniMax, use actual MiniMax model IDs:
- `--model MiniMax-M2.7` (recommended — 200K context)
- `--model MiniMax-M2.5`
- `--model MiniMax-M2.5-highspeed`

---

## Build from Source

```bash
git clone https://github.com/ultraworkers/claw-code /tmp/claw-code
cd /tmp/claw-code/rust
cargo build --workspace
cp target/debug/claw ~/.local/bin/claw-code
chmod +x ~/.local/bin/claw-code
```

Binary is at `~/.local/bin/claw-code` (already installed).

## Permanent Setup (do once)

Add these to your `~/.zshrc` so Claw Code always uses MiniMax:

```bash
export ANTHROPIC_BASE_URL="https://api.minimax.io/anthropic"
export ANTHROPIC_API_KEY="$(grep apiKey ~/.openclaw/openclaw.json 2>/dev/null | sed 's/.*:.*"\(sk-cp-[^"]*\)".*/\1/')"
```

Then: `source ~/.zshrc`

Or replace the API key extraction with the actual key directly:
```bash
export ANTHROPIC_API_KEY="sk-cp-LkwP3CkP8Pft0ZdBl8Wn_zuu_3_hHUzrMIATnnSfScQDtGi8tDvlQTuI8CfBPPypjHUBHx2WhspAevWXlbOEV4ucPHxpGz605dZaLtjEvHYbwTT6cljVJf0"
```

Note: Claw Code also supports `--resume`, session management, `/skills`, `/mcp`, `/team`, and `/cron` — all powered by MiniMax when configured as above.

---

## CLI Basics

| Pattern | Command |
|---|---|
| Interactive REPL | `claw-code` |
| One-shot prompt | `claw-code prompt "your task"` |
| Non-interactive (shorthand) | `claw-code "your task"` |
| JSON output | `claw-code --output-format json prompt "status"` |
| Resume session | `claw-code --resume latest` |
| Doctor/health check | `claw-code doctor` |

---

## Permission Modes

```bash
--permission-mode read-only        # No file writes, no bash mutations
--permission-mode workspace-write  # Can write files in workspace
--permission-mode danger-full-access  # Full access (default if skipped)
--dangerously-skip-permissions     # Skip all permission checks (fastest)
```

---

## Tool Restriction

```bash
# Restrict to specific tools only
claw-code --allowedTools read,glob,grep prompt "explain this"

# Available tools: read, write, edit, bash, glob, grep, websearch, webfetch,
#                   agent, todo, notebook, skill, search
```

---

## Model Selection

```bash
claw-code --model opus prompt "..."     # claude-opus-4-6 (default)
claw-code --model sonnet prompt "..."   # claude-sonnet-4-6
claw-code --model haiku prompt "..."    # claude-haiku-4-5-20251213
```

---

## OpenClaw Exec Patterns

### Foreground (one-shot)

```bash
# MiniMax (default — no separate key needed)
claw-code --model MiniMax-M2.7 --permission-mode workspace-write \
  prompt 'Add error handling to the API'

# shorthand non-interactive mode
claw-code --model MiniMax-M2.7 --dangerously-skip-permissions \
  'refactor the auth module'
```

### Background (longer tasks)

```bash
# Background with PTY
bash pty:true workdir:~/project background:true \
  command:"claw-code --model MiniMax-M2.7 --permission-mode workspace-write prompt 'Build a REST API for todos. When done, run: openclaw system event --text \"Done: Built todos REST API\" --mode now'"
```

### Git-aware Review

```bash
# PR review — clone to temp dir first (NEVER in ~/.openclaw)
REVIEW_DIR=$(mktemp -d)
git clone https://github.com/user/repo.git $REVIEW_DIR
cd $REVIEW_DIR && gh pr checkout 130

bash pty:true workdir:$REVIEW_DIR \
  command:"claw-code --model MiniMax-M2.7 --permission-mode read-only prompt 'Review PR #130. git diff origin/main...origin/pr/130'"

# Clean up
trash $REVIEW_DIR
```

---

## Slash Commands (REPL mode)

Once in the REPL (`claw-code`):

```
/help              — available commands
/status            — current session status
/doctor            — diagnose auth/config/workspace health
/agents            — list configured agents
/mcp               — inspect MCP servers
/skills            — list or install skills
/diff              — show git diff for workspace changes
/commit            — generate commit message + commit
/pr [context]      — draft or create a pull request
/review [scope]    — run code review on current changes
/tasks [list|stop] — manage background tasks
/subagent          — sub-agent orchestration
/team [create]     — team creation for parallel work
/cron [list|add]   — schedule recurring tasks
/model [name]      — switch model mid-session
/permissions       — show/switch permission mode
/compact           — compact session history
/export [file]     — export conversation to file
/plugin            — plugin management
```

---

## Architecture (for debugging/extension)

```
rust/
├── crates/
│   ├── api/              # Provider clients, SSE streaming, auth
│   ├── commands/         # Slash command registry + help rendering
│   ├── runtime/          # Session, config, permissions, MCP, prompts
│   ├── tools/            # Built-in tools + tool discovery
│   ├── plugins/          # Plugin metadata + lifecycle
│   ├── telemetry/        # Session tracing + usage tracking
│   ├── mock-anthropic-service/  # Deterministic mock for testing
│   ├── compat-harness/   # TS manifest extraction
│   └── rusty-claude-cli/ # Main CLI binary (claw)
```

---

## Integration Notes

- **Session persistence**: REPL turns auto-save to `.claw/sessions/<session-id>.jsonl`
- **Config hierarchy**: `~/.claw.json` → `~/.config/claw/settings.json` → `/.claw.json`
- **Workspace context**: Claw Code respects `CLAUDE.md` / project memory files
- **MCP support**: Full MCP server lifecycle (list, show, auth, disconnect)
- **Hooks**: Lifecycle hooks at `/hooks`
- **Sub-agents**: `/subagent list|steer|kill` + `/team create|delete`

---

## ⚠️ Rules

1. **Never run Claw Code inside `~/.openclaw/`** — it will read soul/identity docs
2. **Always use workdir** to scope the agent to the correct project
3. **Git repo required** for one-shot prompts (or init one first)
4. **Monitor background tasks** — use `process action:log` to check progress
5. **Auto-notify on completion** — append `openclaw system event --text "..." --mode now` to long prompts
6. **Review PRs in temp dirs** — never in OpenClaw's own workspace
