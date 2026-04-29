# Hierarchical Context Organization

**Principle:** Structure context in layers from general (system-level) to specific (task-level), allowing models to prioritize relevant information naturally.

## Why

Models process context sequentially. Placing broad instructions first and specific details later mirrors how humans read documents — from overview to detail. This reduces ambiguity and helps the model frame specific information within the right mental model.

## How to Apply

Layer context in this order:
1. **System context** — Role, capabilities, global constraints
2. **Domain context** — Project-specific knowledge, conventions, architecture
3. **Task context** — The specific instruction or question
4. **Input data** — The actual content to process

### Use XML Tags for Disambiguation

XML tags help parse complex prompts unambiguously when mixing instructions, context, examples, and inputs. Use consistent, descriptive tag names (`<instructions>`, `<context>`, `<input>`, `<example>`). Nest tags when content has natural hierarchy.

### Long Context Placement

For large documents (20k+ tokens):
- **Place long documents at the top**, above your query and instructions. Queries at the end improve response quality by up to 30%.
- **Wrap multiple documents** in `<documents>` with `<document index="n">` subtags containing `<source>` and `<document_content>`.
- **Ground responses in quotes** — ask the model to quote relevant parts before answering. This cuts through noise in large contexts.

### Few-Shot Examples

Include 3–5 diverse examples wrapped in `<examples>` / `<example>` tags so the model distinguishes them from instructions. Make examples relevant to your actual use case and cover edge cases.

## Example

```xml
<!-- Layer 1: System -->
<system>You are a code reviewer for a production TypeScript codebase.</system>

<!-- Layer 2: Domain -->
<context>
This project uses NestJS with a hexagonal architecture.
Domain logic lives in src/domain/, adapters in src/adapters/.
We enforce strict null checks and prefer Result types over exceptions.
</context>

<!-- Few-shot examples -->
<examples>
  <example>
    <diff>-let x = getValue()\n+let x: string | null = getValue()</diff>
    <review>Good: adds explicit null type to match strict null checks.</review>
  </example>
</examples>

<!-- Layer 3: Task -->
<instructions>
Review the following diff for architectural violations and type safety issues.
</instructions>

<!-- Layer 4: Input (long content at the bottom, query above) -->
<diff>...</diff>
```

Compare with flat, unstructured context where all of this is jumbled in a single paragraph — the model must work harder to separate instructions from data.

## Sources

- [Context Engineering 2.0](https://arxiv.org/pdf/2510.26493) — "Structure context in layers from general (system-level) to specific (task-level)"
- [Anthropic Prompting Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) — XML tag structuring, long context placement, few-shot examples
