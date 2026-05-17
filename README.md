# minimal-claude-code

A minimal Claude Code plugin with just the essentials.

**Why "minimal-claude-code"?**

There are plenty of Claude Code tools out there that look like magic wands. However, I've found most of them to be bloated with unnecessary features and excessive token usage without real productivity gains. I prefer keeping things minimal. Claude Code itself keeps getting better, so plugins should just fill small gaps.

So, I created this plugin with two principles in mind:

1. It should benefit from the evolution of Claude Code itself.
2. It should provide only essential features that genuinely enhance productivity.

## Installation

### Claude Code

```sh
claude plugin marketplace add https://github.com/Byunk/minimal-claude-code
claude plugin install minimal-claude-code
```

### Codex

```sh
codex --enable plugins plugin marketplace add Byunk/minimal-claude-code
```

You can install the desired plugin by running `/plugins` command in the Codex CLI.

Note that you need to enable `plugin_hooks` in your Codex CLI config to use notify hooks.

```sh
codex features enable plugin_hooks
```

Then run `/hooks` in Codex and trust the plugin hooks.

The Codex marketplace currently exposes:

- `minimal-claude-code`
- `context-engineering`

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
- [**`/create-pr`**](minimal-claude-code/commands/create-pr.md) - Convention-aware GitHub PR creation from the current feature branch

### Agents

- [**code-reviewer**](minimal-claude-code/agents/code-reviewer.md) - Runs `/code-review` analysis in a dedicated read-only subagent context

## Additional Plugins

This marketplace also includes optional plugins that are separate from `minimal-claude-code`.

- [**context-engineering**](context-engineering/skills/context-engineering/) - Design better LLM context for agents, prompts, tools, RAG/MCP servers, and multi-agent systems.

Install it separately:

```sh
claude plugin install context-engineering
```

## Contributing

The minimal plugin stays minimal by design. If you've found a hook, skill, or agent that genuinely improves productivity without bloat, consider opening a PR.
