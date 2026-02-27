/**
 * Example handler — copy this file for each tool you add.
 *
 * TODO:
 * 1. Rename this file and function to match your tool (e.g. getItem.ts / getItem)
 * 2. Replace ApiClient with your renamed client class
 * 3. Replace ExampleSchema with the matching schema from ../utils/schemas.ts
 * 4. Call the appropriate client method and format the response
 */

import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";
import type { ApiClient } from "../utils/apiClient.js";
import { errorResponse } from "../utils/errorResponse.js";

// TODO: replace with the real input schema from ../utils/schemas.ts
// import type { ExampleSchema } from "../utils/schemas.js";
type ExampleSchema = z.ZodObject<Record<string, never>>;

export async function exampleHandler(
  client: ApiClient,
  args: z.infer<ExampleSchema>,
): Promise<CallToolResult> {
  try {
    // TODO: call client method and format the result
    void client;
    void args;
    const result = {}; // TODO: replace with actual API call + formatter

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (e) {
    return errorResponse(e);
  }
}
