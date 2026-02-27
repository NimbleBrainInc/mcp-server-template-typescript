/**
 * MCP server factory.
 *
 * TODO:
 * 1. Replace ApiClient import with your renamed client class
 * 2. Remove the exampleHandler import and add real handler imports
 * 3. Replace each server.registerTool() block with your actual tools
 * 4. Remove the cachedUserId block if your API doesn't need a user URI
 *    pattern (Calendly required it — most APIs don't)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SERVER_NAME, VERSION } from "./constants.js";
import { ApiClient } from "./utils/apiClient.js";

// TODO: import your real schemas from "./utils/schemas.js"
// import { ExampleSchema } from "./utils/schemas.js";

// TODO: import your real handlers from "./handlers/*.js"
// import { exampleHandler } from "./handlers/exampleHandler.js";

export function createServer(apiKey: string): McpServer {
  const client = new ApiClient(apiKey);

  const server = new McpServer({
    name: SERVER_NAME,
    version: VERSION,
  });

  // === Tools ===
  // TODO: replace this block with real tool registrations.
  //
  // Pattern for a read-only tool with input schema:
  //
  //   server.registerTool(
  //     "tool_name",
  //     {
  //       description: "What this tool does",
  //       inputSchema: ExampleSchema.shape,
  //       annotations: { readOnlyHint: true },
  //     },
  //     (args) => exampleHandler(client, args),
  //   );
  //
  // Pattern for a destructive tool:
  //
  //   server.registerTool(
  //     "delete_item",
  //     {
  //       description: "Permanently delete an item",
  //       inputSchema: DeleteItemSchema.shape,
  //       annotations: { destructiveHint: true },
  //     },
  //     (args) => deleteItem(client, args),
  //   );

  // Temporary no-op to allow the file to compile before tools are added.
  void client;

  return server;
}
