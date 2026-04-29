# minimal-claude-code

A minimal Claude Code plugin with just the essentials.

**Why "minimal-claude-code"?**

There are plenty of Claude Code tools out there that look like magic wands. However, I've found most of them to be bloated with unnecessary features and excessive token usage without real productivity gains. I prefer keeping things minimal. Claude Code itself keeps getting better, so plugins should just fill small gaps.

So, I created this plugin with two principles in mind:

1. It should benefit from the evolution of Claude Code itself.
2. It should provide only essential features that genuinely enhance productivity.

## Installation

```sh
claude plugin marketplace add https://github.com/Byunk/minimal-claude-code
claude plugin install minimal-claude-code
```

## What's Included

### Hooks

- [**Notifications**](minimal-claude-code/hooks/) - System notifications when Claude Code needs your attention

![Notification Example](assets/notify-hook.png)

For macOS, you need to allow Script Editor to send notifications.

1. Open **System Settings** > **Notifications**
2. Find **Script Editor** in the app list
3. Enable **Allow Notifications**

### Commands

- [**`/code-review`**](minimal-claude-code/commands/code-review.md) - Context-aware code review with selectable review target (`--base`, `--uncommitted`, `--commit`, or `--custom`)

### Skills

- [**context-engineering**](minimal-claude-code/skills/context-engineering/) - Principles for designing context-efficient AI agents and tools (based on [Anthropic's engineering blog](https://www.anthropic.com/engineering) and [Claude Code system prompts](https://github.com/Piebald-AI/claude-code-system-prompts))

### Agents

- [**code-reviewer**](minimal-claude-code/agents/code-reviewer.md) - Runs `/code-review` analysis in a dedicated read-only subagent context
- [**operator**](minimal-claude-code/agents/operator.md) - Runs verbose operations (build, testing, debugging) in a subagent to keep output out of your context window

**Example: Testing UI with Playwright**

When building a new feature, you need to test UI interactions. Running Playwright directly pollutes your context window with verbose output. Instead:

1. Prompt Claude Code:

```
Test the login form with playwright mcp. Use operator agent.
```

2. The operator agent will:

- Launch the browser and navigate to your page
- Execute the test steps
- Handle any failures and retry if needed
- Return a concise summary of results

3. Your main context stays clean, so you can continue development after testing.

### Recommended MCP Servers

These MCP servers are recommended for use with this plugin:

- [**context7**](https://context7.com/) - Up-to-date docs for LLMs and AI code editors
- [**playwright**](https://github.com/microsoft/playwright-mcp) - Browser automation for testing and web interaction

## Recommended Plugins

A curated list of other plugins worth checking out:

- [**frontend-design**](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design) - Create distinctive, production-grade frontend interfaces with high design quality

## Contributing

This plugin stays minimal by design. If you've found a hook, skill, agent, or MCP server that genuinely improves productivity without bloat, consider opening a PR.
