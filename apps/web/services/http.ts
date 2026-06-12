import { HttpError } from "@/errors/http.error";

export async function http<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new HttpError(response.status, data);
  }

  return data as T;
}
