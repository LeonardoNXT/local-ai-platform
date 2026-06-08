export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly data?: unknown,
  ) {
    super(
      typeof data === "object" && data && "message" in data
        ? String(data.message)
        : "Request failed",
    );

    this.name = "HttpError";
  }
}
