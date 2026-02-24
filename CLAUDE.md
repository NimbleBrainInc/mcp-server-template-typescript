# MCP Server Template — Node.js / TypeScript

NimbleBrain template for building MCP servers that wrap third-party REST APIs.
Replace every `YOUR_*` placeholder before shipping.

## Architecture

```
src/
├── index.ts          # Server entry point — registers all tools
├── config.ts         # Loads API key from environment, exits if missing
├── constants.ts      # SERVER_NAME + VERSION — never edit manually
├── types.ts          # Zod schemas for API responses  (API → Server validation)
├── schemas.ts        # Zod schemas for tool inputs    (Agent → Server validation)
├── formatters.ts     # Strip noisy API fields before returning to agent
├── handlers/         # One file per tool, named after the tool
└── utils/
    ├── apiClient.ts      # HTTP client wrapping the third-party API
    └── errorResponse.ts  # Converts any thrown error → MCP CallToolResult

skills/
└── skill-name/
    └── SKILL.md          # Self-contained skill — no subdirectories
```

The MCP SDK validates tool inputs automatically via `inputSchema: MySchema.shape` (from `schemas.ts`).
Handlers validate API *responses* via Zod schemas in `types.ts` inside `apiClient.ts`.

## Implementation order

1. **`src/types.ts`** — Zod schemas for each API response shape
2. **`src/utils/apiClient.ts`** — rename class + error class, set `BASE_URL`, add one method per endpoint; also update the import in `errorResponse.ts` to match the renamed error class
3. **`src/schemas.ts`** — Zod input schema for each tool
4. **`src/formatters.ts`** — one formatter per resource type (pure functions, no side-effects)
5. **`src/handlers/`** — one file per tool (see Handler pattern below)
6. **`src/index.ts`** — `server.registerTool()` for each tool (see Tool registration below)
7. **`src/config.ts`** — rename `YOUR_API_KEY_ENV_VAR`
8. **`src/constants.ts`** — set `SERVER_NAME` only; version is managed by `make sync`
9. **`manifest.json`** + **`server.json`** — fill all `TODO` fields; run `make sync` after
10. **`tests/`** — fixtures + tests (see Testing below)
11. **`skills/`** — one `SKILL.md` per user-facing workflow

## Handler pattern

```typescript
export async function myTool(
  client: ApiClient,
  args: z.infer<typeof MyInputSchema>,
): Promise<CallToolResult> {
  try {
    const result = await client.myMethod(args.some_field);
    return { content: [{ type: "text", text: JSON.stringify(formatMyResource(result), null, 2) }] };
  } catch (e) {
    return errorResponse(e);
  }
}
```

## Tool registration pattern

```typescript
server.registerTool(
  "tool_name",                       // snake_case — must match manifest.json tools[].name exactly
  {
    description: "...",
    inputSchema: MyInputSchema.shape, // omit entirely for tools with no inputs
    annotations: { readOnlyHint: true }, // or destructiveHint: true for writes/deletes
  },
  (args) => myTool(client, args),
);
```

## Skills

Each skill lives in `skills/<skill-name>/SKILL.md`. Rules:
- **Self-contained** — everything the agent needs is in the single `SKILL.md`; no `references/` subdirectory or separate files (the agent won't find them)
- Include: description, trigger phrases, step-by-step workflow, tools used (table), output format, important notes / confirmation requirements

## Version management

`manifest.json` is the single source of truth for the version.
Never manually edit the version in `package.json`, `server.json`, or `src/constants.ts`.

```bash
make bump VERSION=0.2.0  # updates manifest.json and syncs everywhere
make sync                # re-sync if you edited manifest.json by hand
```

CI enforces that `manifest.json`, `package.json`, `server.json`, and `src/constants.ts` all match.

## Development workflow

```bash
# Check everything
make check

# Dev test before bundling (set your actual env var name)
npm run build
YOUR_API_KEY_ENV_VAR=your_key npx @modelcontextprotocol/inspector node build/index.js --stdio

# Bundle and test end-to-end
make bundle
npx @modelcontextprotocol/inspector mpak run --local ./*.mcpb

# Ship a new version
make bump VERSION=0.2.0 && make bundle
npx @modelcontextprotocol/inspector mpak run --local ./*.mcpb
```

The `.mcpb` filename is derived from `manifest.json` — always use the `*.mcpb` glob.

## Testing

Tests use `InMemoryTransport` to run a real `McpServer` + `Client` pair in-process.
Replace `ApiClient` with a plain `vi.fn()` mock object:

```typescript
const mocks = { myMethod: vi.fn() };
const mockClient = mocks as unknown as ApiClient;
```

Per tool: mock return value → call tool via MCP client → assert on `JSON.parse(getText(result))`.
Also test: missing required inputs → `result.isError === true`; API errors via `mockRejectedValueOnce` → `result.isError === true`.

## Critical conventions

- **Exact dependency versions** — no `^` or `~` in `package.json`; range specifiers are L2 MTF security findings. After any AI-assisted scaffolding, manually verify and bump all deps to latest — AI training cutoff means generated versions are often months out of date.
- **Never edit `src/constants.ts`** — managed by `make bump` / `make sync`
- **Never edit `.github/workflows/`** — shared infrastructure; changes go through the template repo
- **Never commit `.claude/settings.local.json`** — already in `.gitignore`; `git rm` it if present
- **API key via manifest only** — never hardcode; injected as `"YOUR_API_KEY_ENV_VAR": "${user_config.api_key}"` in `manifest.json`, read from `process.env` in `config.ts`
- **`.js` imports** — Node ESM requires the extension: `import ... from "./foo.js"`
- **Entry point is `build/`** not `dist/` — set by `tsconfig.json` `outDir`
- **MTF network permissions** — `server.json` `_meta.org.mpaktrust.permissions.network` must list only the actual API hostname(s)

## Reference

https://github.com/NimbleBrainInc/mcp-calendly
