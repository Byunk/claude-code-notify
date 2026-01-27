# Evaluation Principles

Principles for measuring and improving context engineering effectiveness.

## Start Small, Start Early

### Don't Wait

Begin evaluation with ~20 queries representing real usage patterns. Don't delay until you can build a comprehensive test suite.

### Early Leverage

Early in development, changes have dramatic impact. There's abundant low-hanging fruit. A small eval set catches major issues.

### Growth Path

```
Day 1:   5-10 representative queries
Week 1:  20-30 queries covering main use cases
Month 1: 50-100 queries with edge cases
Ongoing: Add queries from production failures
```

## End-State Evaluation

### Focus on Outcomes

Judge whether the correct final state was achieved, not whether a specific process was followed.

**Good:** "Did the agent find the correct answer?"

**Bad:** "Did the agent use tool X then tool Y then tool Z?"

### Multiple Valid Paths

Acknowledge that agents may take different routes to correct answers. All valid paths should pass evaluation.

### Checkpoint Decomposition

For complex workflows, break into discrete checkpoints:

1. Did the agent identify the right files?
2. Did the agent understand the problem?
3. Did the agent implement a correct solution?
4. Did the tests pass?

Evaluate each checkpoint independently.

## LLM-as-Judge

Use an LLM to evaluate free-form outputs against rubric criteria.

### Core Criteria

| Criterion | Description |
|-----------|-------------|
| Factual accuracy | Claims match the source material |
| Citation accuracy | Sources actually support the claims |
| Completeness | All relevant aspects covered |
| Source quality | Primary sources preferred over secondary |
| Tool efficiency | Right tools used, reasonable call count |

### Scoring

A single LLM call with 0.0-1.0 scores per criterion works well:

```
Evaluate this agent response against the following criteria.
Score each from 0.0 (completely fails) to 1.0 (fully meets).

Response: {agent_response}
Ground truth: {expected_answer}

Criteria:
- Factual accuracy: Does the response match known facts?
- Completeness: Are all key points covered?
- Conciseness: Is it free of unnecessary content?

Output JSON: {"factual_accuracy": 0.X, "completeness": 0.X, "conciseness": 0.X}
```

### Calibration

Run LLM-as-judge on known good/bad examples to calibrate thresholds.

## Human Evaluation

Automated evaluation catches common issues. Human evaluation catches subtle problems.

### What Humans Catch

- Edge cases automation misses
- Hallucinations on unusual queries
- Subtle source selection biases
- Quality issues hard to quantify
- User experience problems

### Sampling Strategy

- Review a random sample of production queries
- Focus extra attention on low-confidence or unusual queries
- Track patterns in human-identified issues
- Add problematic queries to automated suite

### Even With Automation

Human evaluation remains essential. Budget time for regular manual review even as automated coverage grows.

## Key Metrics

### Primary: Token Usage

Token usage explains approximately 80% of performance variance. Track:
- Total tokens per task
- Context utilization ratio
- Token growth over conversation
- Compaction effectiveness

### Secondary Metrics

| Metric | What It Reveals |
|--------|-----------------|
| Tool call count | Efficiency of tool selection |
| Time to completion | Overall speed |
| Retry rate | Error handling quality |
| Context window utilization | How much budget consumed |

### Model Choice Impact

Different models have different cost/performance profiles. Track metrics per model to inform selection.

## Iteration Approach

### Build Simulations

Create simulations with exact prompts and tools:

1. Capture real queries
2. Replay against agent
3. Compare behavior to expected
4. Identify divergences

### Watch Agents Work

Step through agent reasoning:

1. What did the agent observe?
2. What did it decide to do?
3. What was the result?
4. Where did reasoning fail?

### Common Failure Modes

| Failure | Symptom | Fix |
|---------|---------|-----|
| Continuing when done | Extra tool calls after answer found | Clearer completion criteria |
| Verbose queries | Long tool inputs wasting context | Examples of concise queries |
| Wrong tool selection | Similar tools confused | Better descriptions, namespacing |
| Context exhaustion | Quality degrades late in task | Compaction, sub-agents |
| Hallucination | Made-up information | Stricter source requirements |

### Mental Model Development

Build an accurate model of how the agent behaves. This intuition enables:
- Predicting where failures will occur
- Designing effective interventions
- Prioritizing improvements

## Evaluation Design

### Query Requirements

Good evaluation queries are:

| Requirement | Description |
|-------------|-------------|
| Independent | Not dependent on other queries |
| Read-only | Don't modify state |
| Complex | Require multiple steps |
| Realistic | Based on real use cases |
| Verifiable | Clear, checkable answer |
| Stable | Answer won't change over time |

### Answer Verification

For each query:
1. Solve it yourself
2. Verify the answer is correct
3. Confirm answer is unambiguous
4. Check answer remains stable

### Output Format

Structure evaluations for automated running:

```xml
<evaluation>
  <qa_pair>
    <question>How many active users were created in March 2024?</question>
    <answer>42</answer>
  </qa_pair>
</evaluation>
```

## Summary

Effective evaluation:
- Starts small and early, growing over time
- Focuses on end-state correctness, not specific paths
- Uses LLM-as-judge for scalable assessment
- Maintains human review for edge cases
- Tracks token usage as primary metric
- Builds simulations to understand failures
- Develops accurate mental models of agent behavior
