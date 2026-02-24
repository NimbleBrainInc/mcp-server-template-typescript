import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { ApiError } from "./apiClient.js";

/**
 * Converts any thrown error into an MCP CallToolResult with isError: true.
 * TODO: rename ApiError import to match your renamed error class.
 */
export function errorResponse(e: unknown): CallToolResult {
  const msg = e instanceof ApiError ? e.message : String(e);
  return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
}
