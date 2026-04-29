# Quality Over Quantity

**Principle:** Include only relevant context. Precision and accuracy beat exhaustiveness. Remove redundant or contradictory information.

## Why

Context windows are finite. Irrelevant information dilutes signal, increases latency, and can confuse model reasoning. Every token in the context should earn its place.

## How to Apply

- Audit each piece of context: does removing it degrade output quality? If not, cut it.
- Verify factual content before inclusion — stale or wrong context is worse than no context.
- Prefer specific, actionable information over general background.

## Example

Bad — dumping everything:
```
You are an assistant. Here is the entire company handbook (50 pages),
all past conversations (200 messages), the full API documentation,
and every config file in the repo. Now answer: what port does the
dev server run on?
```

Good — curated context:
```
The dev server configuration is in config/dev.yml.
Relevant section:
  server:
    port: 3000
    host: localhost
What port does the dev server run on?
```

## Sources

- [Anthropic Engineering Blog](https://www.anthropic.com/engineering) — "Context is a critical but finite resource for AI agents"
- [Context Engineering 2.0](https://arxiv.org/pdf/2510.26493) — "Prioritize precision and accuracy in provided context"
