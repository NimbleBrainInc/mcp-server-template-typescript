# MCP Server Template — TypeScript

NimbleBrain template for building MCP servers that wrap third-party REST APIs.
Replace every `YOUR_*` placeholder before shipping.

See [README.md](README.md) for setup instructions and [ARCHITECTURE.md](ARCHITECTURE.md) for a deep dive into the codebase.

## Building the bundle

`manifest.json` is the single source of truth for the version. Run `make sync` after editing it by hand.

```bash
make check   # format + lint + typecheck + tests
make bundle  # compile → prune dev deps → pack .mcpb
```

To bump the version:

```bash
make bump VERSION=0.2.0  # updates manifest.json and syncs package.json, server.json, src/constants.ts
```

## Testing — stdio

Test the stdio transport directly with MCP Inspector before bundling:

```bash
npm run build
YOUR_API_KEY_ENV_VAR=your_key npx @modelcontextprotocol/inspector node build/index.js --stdio
```

Or test end-to-end via the bundle:

```bash
make bundle
mpak config set @nimblebraininc/YOUR_SERVER_NAME api_key=your_key_here
npx @modelcontextprotocol/inspector mpak run --local ./*.mcpb
```

## Testing — HTTP with Docker

Build and run the HTTP server in Docker, then connect MCP Inspector to it:

```bash
# 1. Create a .env file with your API key
echo "YOUR_API_KEY_ENV_VAR=your_key_here" > .env

# 2. Build the Docker image
npm run docker:build

# 3. Run the container (binds to localhost:3000)
npm run docker:run

# 4. In a second terminal, connect MCP Inspector
npm run inspect:http
```

The container exposes `POST/GET/DELETE /mcp` (Streamable HTTP) and `GET /health`.
`HOST` defaults to `0.0.0.0` inside Docker; `PORT` defaults to `3000`.

## Implementation order

1. **`src/utils/types.ts`** — Zod schemas for each API response shape
2. **`src/utils/apiClient.ts`** — rename class + error class, set `BASE_URL`, add one method per endpoint; also update the import in `errorResponse.ts` to match the renamed error class
3. **`src/utils/schemas.ts`** — Zod input schema for each tool
4. **`src/utils/formatters.ts`** — one formatter per resource type (pure functions, no side-effects)
5. **`src/handlers/`** — one file per tool (see Handler pattern in ARCHITECTURE.md)
6. **`src/app.ts`** — `server.registerTool()` for each tool
7. **`src/utils/config.ts`** — rename `YOUR_API_KEY_ENV_VAR`
8. **`src/constants.ts`** — set `SERVER_NAME` only; version is managed by `make sync`
9. **`manifest.json`** + **`server.json`** — fill all `TODO` fields; run `make sync` after
10. **`tests/`** — fixtures + tests
11. **`skills/`** — one `SKILL.md` per user-facing workflow
