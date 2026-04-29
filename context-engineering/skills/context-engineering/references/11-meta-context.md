# Meta-Context

**Principle:** Include information about the context itself — explaining *why* certain information is provided helps models weight it appropriately.

## Why

Models don't inherently know which parts of the context are most important. Meta-context acts as a guide, telling the model how to interpret and prioritize the information it receives. This is especially valuable when context is large or mixed-priority.

## How to Apply

- Add brief annotations explaining the purpose of each context section.
- Flag which information is authoritative vs. supplementary.
- Indicate recency and reliability of data sources.
- Explain the relationship between context sections.
- **Provide motivation for instructions** — explaining *why* a behavior is important helps the model generalize correctly (e.g., "never use ellipses" is vague; "your response will be read aloud by a TTS engine, so never use ellipses" lets the model also avoid other TTS-unfriendly patterns).
- **Use grounding directives** — `<investigate_before_answering>` meta-context tells the model to read referenced files before answering, reducing hallucinations about code it hasn't opened.

## Example

Without meta-context:
```
Company handbook section 4.2: Employees must use 2FA for all internal tools.
Slack message from @devops (2 days ago): "We're temporarily disabling 2FA
on staging while we debug the SSO integration."
User question: Do I need 2FA for staging?
```

With meta-context:
```
[POLICY — authoritative, last updated 2024-01]:
Company handbook section 4.2: Employees must use 2FA for all internal tools.

[OPERATIONAL UPDATE — temporary override, from @devops 2 days ago]:
"We're temporarily disabling 2FA on staging while we debug the SSO integration."
Note: This is a temporary exception. Defer to the operational update for
staging-specific questions, but reference the policy as the default.

User question: Do I need 2FA for staging?
```

The annotated version helps the model correctly prioritize the temporary override for staging while maintaining the policy as the baseline answer for other environments.

## Sources

- [Context Engineering 2.0](https://arxiv.org/pdf/2510.26493) — "Include information about the context itself — explaining why certain information was provided helps models weight it appropriately"
- [Anthropic Prompting Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) — Motivation behind instructions, `<investigate_before_answering>` grounding directive
