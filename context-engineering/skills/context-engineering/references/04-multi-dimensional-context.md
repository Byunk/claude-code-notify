# Multi-Dimensional Context

**Principle:** Effective context spans multiple categories: task definition, domain knowledge, interaction history, constraints, and output format expectations.

## Why

Models perform best when they understand not just *what* to do, but *how*, *why*, and *within what boundaries*. Missing any dimension forces the model to guess, leading to inconsistent or wrong outputs.

## How to Apply

For each context design, check coverage across these dimensions:

| Dimension | Question | Example |
|-----------|----------|---------|
| **Task** | What exactly should the model do? | "Classify this support ticket by urgency" |
| **Domain** | What specialized knowledge is needed? | "Our SLA tiers: P0 = 1hr, P1 = 4hr, P2 = 24hr" |
| **History** | What happened before this interaction? | "The customer has escalated twice already" |
| **Constraints** | What must the model avoid or respect? | "Never auto-close P0 tickets" |
| **Motivation** | Why does this matter? What's the goal? | "Response will be read aloud by a TTS engine" |
| **Format** | What should the output look like? | "Return JSON: {urgency, reasoning, suggested_action}" |

## Example

Incomplete — missing constraints and format:
```
Classify this ticket: "Production database is down"
```

Complete — all dimensions covered:
```
Task: Classify the following support ticket by urgency tier.
Domain: Urgency tiers are P0 (service down), P1 (degraded), P2 (inconvenience).
        Database outages always qualify as P0.
History: This customer (Acme Corp) is on an Enterprise SLA.
Constraints: If P0, do not auto-respond. Route to on-call immediately.
Format: {"urgency": "P0"|"P1"|"P2", "reasoning": "...", "route_to": "..."}

Ticket: "Production database is down, all API requests returning 500"
```

## Sources

- [Context Engineering 2.0](https://arxiv.org/pdf/2510.26493) — "Effective context spans multiple categories"
