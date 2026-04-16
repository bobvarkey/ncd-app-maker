# LLM Council Skill

Routes `/llm council` commands to the local LLM Council backend running on port 8645.

## Usage

```
/llm council <question>
```

## Behavior

1. Parse the user query after the command
2. POST to `http://localhost:8645/api/conversations` to create a new conversation
3. POST to streaming endpoint `/api/conversations/{id}/message/stream`
4. Parse SSE stream events and display results by stage
5. If stream times out, show Stage 1 results (individual model responses) as fallback

## API Details

- Backend URL: `http://localhost:8645`
- Create conversation: `POST /api/conversations`
- Streaming: `POST /api/conversations/{id}/message/stream` (SSE)
- Blocking: `POST /api/conversations/{id}/message`

## Stream Event Types

- `stage1_start` → "🤖 Collecting responses from council..."
- `stage1_complete` → Show each model's response in numbered blocks
- `stage2_start` → "🔍 Peer review in progress..."
- `stage2_complete` → Show aggregate rankings
- `stage3_start` → "⚖️ Chairman deliberating..."
- `stage3_complete` → Show final synthesized answer
- `complete` → Done

## Response Format

For Stage 1 results, display as:

```
🗳️ **Council Member 1** (model name)
[response content]

🗳️ **Council Member 2** (model name)
[response content]
```

For Stage 2/3, accumulate and display once complete.

## Error Handling

- Backend unreachable → "Council is not in session. Run: `cd ~/llm-council && uv run uvicorn backend.main:app --host 0.0.0.0 --port 8645 &`"
- All models fail → "All council members failed to respond."
- Partial timeout → Display Stage 1 results with note: "Council still deliberating (Stage 2 timed out). Above are individual responses."

## Note on Timing

Stage 2 (peer review) can be slow with local models. If it times out, Stage 1 responses are still shown — the council's work isn't lost.