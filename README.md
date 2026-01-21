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

- **Notification sounds** - Beeps when Claude Code waits for your input

### Commands & Skills

- **`/quick-review`** - Quick code quality check

### Agents

- **operator** - Runs verbose operations (build, testing, debugging) in a subagent to keep output out of your context window

### MCP Servers

- [**context7**](https://context7.com/) - Latest docs for any library
