# TODO: replace with the skill name (e.g. "Cancel Event", "Create Issue")

## Description

TODO: one sentence describing what this skill helps the user accomplish.

## Trigger phrases

TODO: list natural language phrases that should invoke this skill. Examples:
- "cancel my meeting with..."
- "reschedule the 3pm call"

## Workflow

TODO: describe the step-by-step workflow the agent should follow:

1. Call `list_items` to find the relevant resource
2. Confirm with the user before taking any destructive action
3. Call `delete_item` with the confirmed ID
4. Report the outcome

## Tools used

| Tool | Purpose |
|------|---------|
| `TODO_tool_name` | TODO: describe why this tool is called |

## Output format

TODO: describe what the agent should return to the user. Example:

```
✅ Done — item "NAME" has been deleted.
```

## Important notes

- TODO: add any caveats, confirmation requirements, or irreversibility warnings
