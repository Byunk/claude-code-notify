# Guide Model Thinking

**Principle:** Control reasoning depth via adaptive thinking and effort parameters. Prevent overthinking on simple tasks and guide interleaved thinking after tool use.

## Why

Claude 4.6 does significantly more upfront exploration than previous models. This often improves results, but the model may gather extensive context or pursue multiple research threads without being prompted. Without guidance, simple tasks get overthought (wasting tokens and time) while complex tasks may not get enough structured reasoning.

## How to Apply

- **Use the effort parameter** (low/medium/high/max) for coarse control over thinking depth. Lower effort for simple tasks, higher for complex multi-step reasoning.
- **Use adaptive thinking** (`thinking: {type: "adaptive"}`) instead of manual `budget_tokens` — the model dynamically decides when and how much to think based on query complexity and effort level.
- **Guide interleaved thinking** — after tool results, prompt the model to reflect before proceeding: "After receiving tool results, carefully reflect on their quality and determine optimal next steps before proceeding."
- **Prevent overthinking** — "Choose an approach and commit to it. Avoid revisiting decisions unless you encounter new information that directly contradicts your reasoning."
- **Replace blanket defaults with targeted instructions** — instead of "Default to using [tool]," use "Use [tool] when it would enhance your understanding of the problem."
- **Remove over-prompting** — instructions like "If in doubt, use [tool]" that compensated for older models' conservatism will cause overtriggering in Claude 4.6.

## Example

Unguided — overthinks a simple rename:
```python
# Model spends 2000 thinking tokens analyzing implications,
# reading 5 files, checking test coverage... for a variable rename
client.messages.create(
    model="claude-opus-4-6",
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},  # too much for a rename
    messages=[{"role": "user", "content": "Rename 'usr' to 'user' in config.py"}],
)
```

Guided — calibrated to task complexity:
```python
# Simple rename: low effort, minimal thinking
client.messages.create(
    model="claude-opus-4-6",
    thinking={"type": "adaptive"},
    output_config={"effort": "low"},
    messages=[{"role": "user", "content": "Rename 'usr' to 'user' in config.py"}],
)

# Complex refactoring: high effort, guided thinking
client.messages.create(
    model="claude-opus-4-6",
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "Refactor the auth module to use JWT..."}],
)
```

System prompt for agentic workflows:
```
After receiving tool results, carefully reflect on their quality and
determine optimal next steps before proceeding. Use your thinking to
plan and iterate based on this new information.

When deciding how to approach a problem, choose an approach and commit
to it. Avoid revisiting decisions unless you encounter new information
that directly contradicts your reasoning.
```

## Sources

- [Anthropic Prompting Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) — Adaptive thinking, interleaved thinking, overthinking guidance for Claude 4.6
- [Adaptive Thinking](https://docs.anthropic.com/en/docs/build-with-claude/adaptive-thinking) — Dynamic thinking calibration
