/**
 * Response formatters — strip noisy API fields and return clean objects
 * that the agent receives as JSON text.
 *
 * TODO: add a formatter for each resource type returned by your API. Example:
 *
 *   import type { MyResource } from "./types.js";
 *
 *   export function formatMyResource(r: MyResource) {
 *     return {
 *       id: r.id,
 *       name: r.name,
 *       created_at: r.created_at,
 *       // omit large or irrelevant fields
 *     };
 *   }
 *
 * Keep formatters pure (no side-effects). Handlers call them before
 * building the CallToolResult.
 */
