import { describe, expect, it } from "vitest";
import { ApiError } from "../src/utils/apiClient.js";

/**
 * TODO: rename ApiError import to match your renamed error class, then add
 * tests for any non-trivial client logic (e.g. param building, response parsing).
 */

describe("ApiError", () => {
  it("should create an error with status and message", () => {
    const err = new ApiError(401, "Unauthorized", "Invalid API key");
    expect(err.status).toBe(401);
    expect(err.statusText).toBe("Unauthorized");
    expect(err.message).toBe("Invalid API key");
    expect(err.name).toBe("ApiError");
  });
});
