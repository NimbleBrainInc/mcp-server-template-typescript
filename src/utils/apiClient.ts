/**
 * HTTP client for YOUR_SERVICE API.
 *
 * TODO:
 * 1. Rename this class (e.g. GitHubClient, LinearClient)
 * 2. Replace YOUR_API_BASE_URL with the actual base URL
 * 3. Update the Authorization header format if needed
 *    (Bearer token, Basic auth, x-api-key header, etc.)
 * 4. Replace the error class name (e.g. GitHubApiError)
 * 5. Add one method per API endpoint your tools need
 * 6. Import and use the Zod schemas from ../types.ts for response validation
 */

// TODO: rename to match your service (e.g. GitHubApiError)
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const BASE_URL = "YOUR_API_BASE_URL"; // TODO: e.g. "https://api.github.com"

// TODO: rename to match your service (e.g. GitHubClient)
export class ApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  protected async request(
    path: string,
    options?: RequestInit,
  ): Promise<unknown> {
    const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        // TODO: adjust auth header for your API
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new ApiError(
        res.status,
        res.statusText,
        // TODO: rename ApiError to match your service
        `API error ${res.status}: ${body}`,
      );
    }

    return res.json();
  }

  // TODO: add methods for each endpoint your tools need. Example:
  //
  // async getItem(id: string): Promise<MyResource> {
  //   const data = await this.request(`/items/${id}`);
  //   return MyResourceSchema.parse((data as { resource: unknown }).resource);
  // }
  //
  // async listItems(options?: { count?: number; pageToken?: string }): Promise<PaginatedResponse<MyResource>> {
  //   const params = new URLSearchParams();
  //   if (options?.count) params.set("count", String(options.count));
  //   if (options?.pageToken) params.set("page_token", options.pageToken);
  //   const data = await this.request(`/items?${params}`);
  //   return paginatedSchema(MyResourceSchema).parse(data);
  // }
}
