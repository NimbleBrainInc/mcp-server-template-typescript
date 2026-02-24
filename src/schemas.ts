import { z } from "zod";

/**
 * Schemas for runtime validation of input from Agent → MCP Server.
 * Each exported schema corresponds to one tool's inputSchema.
 *
 * TODO: add a Zod schema for every tool you register in index.ts. Example:
 *
 *   export const GetItemSchema = z.object({
 *     item_id: z.string().describe("The unique ID of the item"),
 *   });
 *
 *   export const ListItemsSchema = z.object({
 *     count: z.number().optional().describe("Maximum number of items to return"),
 *     page_token: z.string().optional().describe("Pagination token"),
 *   });
 */

// Keep this export so the file is a valid module until you add real schemas.
export const _placeholder = z.never();
