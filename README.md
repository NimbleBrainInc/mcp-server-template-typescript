# mcp-server-template-node-ts

A production-ready template for building NimbleBrain MCP servers in TypeScript + Node.js.

## What's included

- TypeScript project wired up with `@modelcontextprotocol/sdk`
- Zod-validated tool inputs and API responses
- Makefile with `build`, `test`, `lint`, `format`, `typecheck`, `bundle`, and version-sync targets
- GitHub Actions: CI (lint + test + bundle smoke test), release bundler, MTF security scanner
- Vitest test setup using `InMemoryTransport` for integration testing without a live server
- Skill markdown template for authoring Claude Code companion skills

## How to use this template

### 1. Copy and rename

```bash
cp -r mcp-server-template-node-ts mcp-YOUR_SERVER_NAME
cd mcp-YOUR_SERVER_NAME
```

### 2. Search and replace placeholders

| Placeholder | Replace with |
|---|---|
| `YOUR_SERVER_NAME` | Short identifier, e.g. `github`, `linear`, `slack` |
| `YOUR_DISPLAY_NAME` | Human-readable name, e.g. `GitHub` |
| `YOUR_REPO_NAME` | GitHub repo name, e.g. `mcp-github` |
| `YOUR_API_BASE_URL` | API base URL, e.g. `https://api.github.com` |
| `YOUR_API_KEY_ENV_VAR` | Env var name, e.g. `GITHUB_TOKEN` |
| `YOUR_API_HOST` | Hostname for MTF permissions, e.g. `api.github.com` |
| `YOUR_GITHUB_USERNAME` | Your GitHub handle |

### 3. Implement your server

In order:

1. **`src/types.ts`** — add Zod schemas for each API response type
2. **`src/utils/apiClient.ts`** — rename the class and add methods for each endpoint
3. **`src/schemas.ts`** — add Zod schemas for each tool's input
4. **`src/formatters.ts`** — add formatters that strip noisy fields from API responses
5. **`src/handlers/`** — add one file per tool, following the `exampleHandler.ts` pattern
6. **`src/index.ts`** — register each tool with `server.registerTool()`
7. **`src/config.ts`** — rename the env var
8. **`src/constants.ts`** — set `SERVER_NAME`
9. **`manifest.json`** + **`server.json`** — fill in all `TODO` fields
10. **`tests/`** — add fixture data and write tests for each tool

### 4. Verify

```bash
npm install
make check   # format + lint + typecheck + tests
make bundle  # build .mcpb locally
```

### 5. Test locally with mpak

```bash
mpak config set @nimblebraininc/YOUR_SERVER_NAME api_key=your_key_here
mpak run --local ./YOUR_SERVER_NAME.mcpb
```

Use MCP Inspector for a GUI:

```bash
npx @modelcontextprotocol/inspector mpak run --local ./YOUR_SERVER_NAME.mcpb
```

## File reference

```
src/
├── index.ts          # Server entry point — registers all tools
├── config.ts         # Loads API key from environment
├── constants.ts      # SERVER_NAME + VERSION
├── types.ts          # Zod schemas for API responses (API → Server validation)
├── schemas.ts        # Zod schemas for tool inputs (Agent → Server validation)
├── formatters.ts     # Strip noisy fields before returning to agent
├── handlers/         # One file per tool
└── utils/
    ├── apiClient.ts      # HTTP client — rename + add endpoint methods
    └── errorResponse.ts  # Error → MCP CallToolResult

tests/
├── server.test.ts    # Integration tests via InMemoryTransport
├── client.test.ts    # Unit tests for ApiError + client logic
└── fixtures.ts       # Mock data matching types.ts shapes

skills/
└── example-skill/
    └── SKILL.md      # Companion skill template

manifest.json         # MCP bundle manifest (source of truth for metadata)
server.json           # MCP registry schema
mpak.json             # Package metadata
Makefile              # Build automation (manifest.json is version source of truth)
```
