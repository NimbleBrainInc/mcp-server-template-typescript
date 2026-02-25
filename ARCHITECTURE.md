# Architecture

Deep dive into how this template is structured and why.

## File tree

```
src/
├── index.ts            # Stdio entrypoint — connects McpServer to StdioServerTransport
├── server.ts           # HTTP entrypoint — Streamable HTTP via Express (for Docker/cloud)
├── app.ts              # McpServer factory — createServer(apiKey) registers all tools
├── constants.ts        # SERVER_NAME + VERSION — never edit manually
├── handlers/           # One file per tool, named after the tool
│   └── exampleHandler.ts
└── utils/
    ├── apiClient.ts    # HTTP client wrapping the third-party API
    ├── config.ts       # Loads API key from environment, exits if missing
    ├── errorResponse.ts# Converts any thrown error → MCP CallToolResult
    ├── formatters.ts   # Strip noisy API fields before returning to agent
    ├── schemas.ts      # Zod schemas for tool inputs (Agent → Server validation)
    └── types.ts        # Zod schemas for API responses (API → Server validation)

tests/
├── server.test.ts      # Integration tests via InMemoryTransport
├── client.test.ts      # Unit tests for ApiError + client logic
└── fixtures.ts         # Mock data matching types.ts shapes

skills/
└── example-skill/
    └── SKILL.md        # Companion skill template

manifest.json           # MCP bundle manifest (source of truth for metadata + version)
server.json             # MCP registry schema
mpak.json               # Package metadata
Makefile                # Build automation
Dockerfile              # HTTP server container image
```

## Entry points

There are two separate entrypoints, both using the same `createServer()` factory from `app.ts`:

### `src/index.ts` — stdio

Used by mpak to run the server locally. Connects the McpServer to a `StdioServerTransport`. This is what `manifest.json` points to via `build/index.js`.

### `src/server.ts` — HTTP (Streamable HTTP)

Used for cloud deployments and Docker-based testing. Runs an Express app on port 3000 with three routes:

- `POST /mcp` — handles new session initialization and existing session requests
- `GET /mcp` — SSE stream for server-sent events
- `DELETE /mcp` — session teardown
- `GET /health` — health check (used by Docker `HEALTHCHECK`)

Each HTTP session creates its own `McpServer` instance (via `createServer()`), allowing multiple clients to connect concurrently without sharing state.

## `src/app.ts` — McpServer factory

`createServer(apiKey)` is the single place where tools are registered. It:

1. Instantiates the API client with the provided key
2. Creates an `McpServer` with the server name and version from `constants.ts`
3. Calls `server.registerTool()` for each tool
4. Returns the connected server

Both entrypoints call `createServer()` — this keeps the tool registration logic in one place and makes it trivial to test (see Testing below).

## `src/utils/apiClient.ts` — HTTP client

Wraps the third-party REST API. Responsibilities:

- Holds the base URL and API key
- Provides a typed `request()` method that handles auth headers and error throwing
- Exposes one method per API endpoint (e.g. `getItem()`, `listItems()`)
- Validates API responses using Zod schemas from `types.ts`

Throws `ApiError` on non-2xx responses. `errorResponse.ts` catches these and converts them to MCP error results.

## `src/utils/types.ts` — API response schemas

Zod schemas that describe the shape of data returned by the external API. These are used inside `apiClient.ts` to validate responses at runtime. Each schema has a corresponding inferred TypeScript type exported alongside it.

## `src/utils/schemas.ts` — tool input schemas

Zod schemas that describe the inputs each tool accepts from the agent. Passed directly to `server.registerTool()` as `inputSchema: MySchema.shape`. The MCP SDK validates agent inputs automatically before your handler is called.

## `src/utils/formatters.ts` — response formatters

Pure functions that take a validated API response object and return a leaner version for the agent. Stripping noisy or redundant fields keeps responses concise and reduces token usage. Handlers call formatters before building the `CallToolResult`.

## `src/handlers/` — tool handlers

One file per tool. Each handler:

- Accepts a typed API client and Zod-inferred args
- Calls the appropriate client method(s)
- Formats the result via a formatter
- Returns a `CallToolResult` with `content: [{ type: "text", text: JSON.stringify(...) }]`
- Wraps everything in try/catch and delegates errors to `errorResponse()`

Pattern:

```typescript
export async function myTool(
  client: ApiClient,
  args: z.infer<typeof MyInputSchema>,
): Promise<CallToolResult> {
  try {
    const result = await client.myMethod(args.some_field);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(formatMyResource(result), null, 2),
        },
      ],
    };
  } catch (e) {
    return errorResponse(e);
  }
}
```

## `src/utils/errorResponse.ts`

Converts any thrown value into a valid MCP `CallToolResult` with `isError: true`. Checks if the error is an `ApiError` (HTTP error) to surface a clean message; falls back to `String(e)` for anything else.

## `src/constants.ts`

Exports `SERVER_NAME` and `VERSION`. **Never edit this file manually** — both values are managed by the Makefile:

```bash
make bump VERSION=0.2.0  # updates manifest.json and syncs everywhere
make sync                # re-sync if you edited manifest.json by hand
```

CI enforces that `manifest.json`, `package.json`, `server.json`, and `src/constants.ts` all carry the same version.

## Validation flow

```
Agent → MCP SDK (validates inputSchema) → Handler → ApiClient → External API
                                                           ↓
                                          Zod (validates API response)
                                                           ↓
                                              Formatter → CallToolResult → Agent
```

## Testing

Tests use `InMemoryTransport` to run a real `McpServer` + `Client` pair in-process with no network calls. The API client is replaced with a plain `vi.fn()` mock object:

```typescript
const mocks = { myMethod: vi.fn() };
const mockClient = mocks as unknown as ApiClient;
```

Per tool: mock return value → call tool via MCP client → assert on `JSON.parse(getText(result))`.

Also test: missing required inputs → `result.isError === true`; API errors via `mockRejectedValueOnce` → `result.isError === true`.

## Version management

`manifest.json` is the single source of truth for the version. Never manually edit the version in `package.json`, `server.json`, or `src/constants.ts` — always go through `make bump` or `make sync`.

## Skills

Each skill lives in `skills/<skill-name>/SKILL.md`. Rules:

- **Self-contained** — everything the agent needs is in the single `SKILL.md`; no subdirectories or separate files (the agent won't find them)
- Include: description, trigger phrases, step-by-step workflow, tools used (table), output format, important notes / confirmation requirements

## Critical conventions

- **Exact dependency versions** — no `^` or `~` in `package.json`; range specifiers are L2 MTF security findings
- **Never edit `src/constants.ts`** — managed by `make bump` / `make sync`
- **Never edit `.github/workflows/`** — shared infrastructure; changes go through the template repo
- **Never commit `.claude/settings.local.json`** — already in `.gitignore`; `git rm` it if present
- **API key via manifest only** — never hardcode; injected as `"YOUR_API_KEY_ENV_VAR": "${user_config.api_key}"` in `manifest.json`, read from `process.env` in `config.ts`
- **`.js` imports** — Node ESM requires the extension: `import ... from "./foo.js"`
- **Entry point is `build/`** not `dist/` — set by `tsconfig.json` `outDir`
- **MTF network permissions** — `server.json` `_meta.org.mpaktrust.permissions.network` must list only the actual API hostname(s)
