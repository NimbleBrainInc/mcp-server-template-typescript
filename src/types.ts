import { z } from "zod";

/**
 * Schemas for runtime validation of data from the external API → MCP Server.
 *
 * TODO: define a Zod schema for each resource your API returns, then export
 * the inferred TypeScript types below. Example:
 *
 *   export const MyResourceSchema = z.object({
 *     id: z.string(),
 *     name: z.string(),
 *     created_at: z.string(),
 *   });
 *   export type MyResource = z.infer<typeof MyResourceSchema>;
 *
 * If your API returns paginated lists, add a generic pagination helper:
 *
 *   export const paginatedSchema = <T extends z.ZodTypeAny>(item: T) =>
 *     z.object({
 *       collection: z.array(item),
 *       pagination: z.object({ ... }),
 *     });
 *   export type PaginatedResponse<T> = { collection: T[]; pagination: { ... } };
 */

// Keep this export so the file is a valid module until you add real schemas.
export const _placeholder = z.never();
