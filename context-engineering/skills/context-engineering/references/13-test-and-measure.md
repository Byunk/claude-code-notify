# Test and Measure Systematically

**Principle:** A/B test context variations with consistent evaluation metrics. Measure performance and iterate constantly.

## Why

Intuition about what context "should" help is often wrong. Systematic testing reveals which context elements actually improve output quality — and which add noise. Without measurement, context design is guesswork.

## How to Apply

- Define clear evaluation criteria before testing (accuracy, relevance, format compliance).
- Change one context variable at a time to isolate effects.
- Test across diverse inputs, not just easy cases.
- Document which context elements proved most influential on successful outputs.
- Monitor context effectiveness over time — what works today may not work after a model update.

## Example

Testing tool description variations for a code search tool:

```python
# Variation A: Minimal description
tool_a = {
    "description": "Search code in the repository"
}

# Variation B: Detailed with examples
tool_b = {
    "description": "Search for code patterns using regex. "
                   "Returns file paths and line numbers. "
                   "Example: pattern='def process_' finds all functions "
                   "starting with 'process_'. Use file_type to filter."
}

# Evaluation over 100 test queries
results_a = evaluate(tool_a, test_queries)  # 62% correct tool use
results_b = evaluate(tool_b, test_queries)  # 89% correct tool use

# Variation B wins. Document and adopt.
```

Track metrics over time:
```
| Date       | Context Version | Accuracy | Avg Tokens | Latency |
|------------|-----------------|----------|------------|---------|
| 2024-01-15 | v1 (minimal)    | 62%      | 1,200      | 1.2s    |
| 2024-02-01 | v2 (detailed)   | 89%      | 1,800      | 1.5s    |
| 2024-03-01 | v3 (pruned)     | 91%      | 1,400      | 1.3s    |
```

## Sources

- [Context Engineering 2.0](https://arxiv.org/pdf/2510.26493) — "Test context variations systematically. Measure performance across different context designs."
- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — "Measure performance and iterate constantly"
