import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

/**
 * Integration tests for the MCP server.
 *
 * TODO:
 * 1. Import your real client type, schemas, and handlers
 * 2. Add a vi.fn() mock for each client method
 * 3. Register all tools in createTestServer()
 * 4. Write a test case for each tool
 *
 * The pattern: spin up a real McpServer + Client pair over InMemoryTransport,
 * control the client with vi.fn() mocks, and assert on the text content
 * returned by each tool.
 */

// TODO: import your client type
// import type { ApiClient } from "../src/utils/apiClient.js";

// TODO: import your schemas
// import { ExampleSchema } from "../src/schemas.js";

// TODO: import your handlers
// import { exampleHandler } from "../src/handlers/exampleHandler.js";

// TODO: import fixtures
// import { mockMyResource } from "./fixtures.js";

// Mock client — one vi.fn() per client method
const mocks = {
  // TODO: add one entry per method on your ApiClient
  // exampleMethod: vi.fn(),
};

// TODO: cast to your real client type
// const mockClient = mocks as unknown as ApiClient;

function createTestServer(): McpServer {
  const server = new McpServer({ name: "test-server", version: "0.0.0" });

  // TODO: register tools here, same pattern as src/index.ts but using mockClient.
  // server.registerTool(
  //   "tool_name",
  //   { description: "...", inputSchema: ExampleSchema.shape },
  //   (args): Promise<CallToolResult> => exampleHandler(mockClient, args),
  // );

  return server;
}

describe("YOUR_SERVER_NAME MCP server", () => {
  let client: Client;
  let server: McpServer;

  beforeAll(async () => {
    server = createTestServer();
    client = new Client({ name: "test-client", version: "0.0.0" });

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);
  });

  afterAll(async () => {
    await client.close();
    await server.close();
  });

  function getText(result: Awaited<ReturnType<typeof client.callTool>>) {
    return (result.content as Array<{ type: string; text: string }>)[0].text;
  }

  // ----- Tool registration -----

  // TODO: once you've registered tools in createTestServer(), replace it.todo
  // with a real assertion:
  //   const { tools } = await client.listTools();
  //   expect(tools).toHaveLength(N);
  //   expect(tools.map(t => t.name).sort()).toEqual([...]);
  it.todo("lists all registered tools with correct names", () => {
    void getText; // remove once getText is used in real tests
    void mocks;
  });

  // TODO: add a describe block per tool. Example:
  //
  // it("example_tool returns formatted result", async () => {
  //   mocks.exampleMethod.mockResolvedValueOnce(mockMyResource);
  //   const result = await client.callTool({ name: "example_tool", arguments: { id: "123" } });
  //   const parsed = JSON.parse(getText(result));
  //   expect(parsed.id).toBe("RESOURCE_123");
  // });
  //
  // it("example_tool returns error for missing id", async () => {
  //   const result = await client.callTool({ name: "example_tool", arguments: {} });
  //   expect(result.isError).toBe(true);
  // });
});
