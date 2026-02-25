# mcp-server-template-node-ts

A production-ready template for building [NimbleBrain](https://nimblebrain.ai) MCP servers in TypeScript + Node.js.

Use this template to wrap any third-party REST API as an MCP server that ships as an `.mcpb` bundle via [mpak](https://nimblebrain.ai).

## What's included

- TypeScript project wired up with `@modelcontextprotocol/sdk`
- Zod-validated tool inputs and API responses
- Stdio entrypoint (`src/index.ts`) and HTTP entrypoint (`src/server.ts`) via Streamable HTTP
- Dockerfile for running the HTTP server in Docker
- Makefile with `build`, `test`, `lint`, `format`, `typecheck`, `bundle`, and version-sync targets
- GitHub Actions: CI (lint + test + bundle smoke test), release bundler, MTF security scanner
- Vitest test setup using `InMemoryTransport` for integration testing without a live server
- Skill markdown template for authoring Claude Code companion skills

## Requirements

- Node.js 24+
- npm
- [`mpak`](https://nimblebrain.ai) (for local testing)
- Docker (optional, for HTTP transport testing)
- `jq` (used by the Makefile for version management)

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

1. **`src/utils/types.ts`** — Zod schemas for each API response type
2. **`src/utils/apiClient.ts`** — rename the class and add methods for each endpoint
3. **`src/utils/schemas.ts`** — Zod schemas for each tool's input
4. **`src/utils/formatters.ts`** — formatters that strip noisy fields from API responses
5. **`src/handlers/`** — one file per tool, following the `exampleHandler.ts` pattern
6. **`src/app.ts`** — register each tool with `server.registerTool()`
7. **`src/utils/config.ts`** — rename the env var
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

## Reference

See [ARCHITECTURE.md](ARCHITECTURE.md) for a deep dive into how each part of the codebase works.

For bundle creation, testing, and Docker workflows, see [CLAUDE.md](CLAUDE.md).
