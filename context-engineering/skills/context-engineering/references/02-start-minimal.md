# Start Minimal, Layer Progressively

**Principle:** Begin with essential context only. Expand based on observed performance gaps, not speculation.

## Why

Over-engineering context upfront leads to bloat, wasted tokens, and harder debugging. Starting minimal lets you identify exactly which context additions improve output — and which don't.

## How to Apply

1. Start with the bare minimum: task instruction + immediate input.
2. Evaluate output quality.
3. If output fails, diagnose *why* — is the model missing domain knowledge? Format expectations? Constraints?
4. Add only the context that addresses the specific gap.
5. Re-evaluate. Repeat.

## Example

Iteration 1 — minimal:
```
Summarize this pull request: <diff>
```
Result: Summary is too generic, misses business context.

Iteration 2 — add domain context:
```
This PR is part of the payment processing service. The team is
migrating from Stripe v2 to v3 API. Key concern: backwards
compatibility with existing webhooks.

Summarize this pull request: <diff>
```
Result: Summary now highlights migration-relevant changes and webhook impact.

Iteration 3 — not needed. Don't add more unless quality drops.

## Sources

- [Context Engineering 2.0](https://arxiv.org/pdf/2510.26493) — "Start minimal: Begin with essential context only, expanding based on performance gaps"
- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — "Finding the simplest solution possible, and only increasing complexity when needed"
