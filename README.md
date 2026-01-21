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

- **Notifications** - System notifications when Claude Code needs your attention

For macOS, you need to allow Script Editor to send notifications.

1. Open **System Settings** > **Notifications**
2. Find **Script Editor** in the app list
3. Enable **Allow Notifications**

### Commands & Skills

- **`/quick-review`** - Quick code quality check

### Agents

- **operator** - Runs verbose operations (build, testing, debugging) in a subagent to keep output out of your context window

### MCP Servers

- [**context7**](https://context7.com/) - Latest docs for any library
- [**playwright**](https://github.com/microsoft/playwright-mcp) - Browser automation for testing and web interaction

## Contributing

This plugin stays minimal by design. If you've found a hook, skill, agent, or MCP server that genuinely improves productivity without bloat, consider opening a PR.
