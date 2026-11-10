import { Cat } from "./cat";

const BASE_URL = "https://api.api-ninjas.com/v1/cats?name=abyssinian";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(BASE_URL + path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": "6LUpvh1k2d2vwPmRRSpJi5zuUkROdr2E1eiWFoAq",
      ...init?.headers,
    },
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    // NestJS errors look like { statusCode, message, error }
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : (body?.message ?? `Request failed with status ${response.status}`);
    throw new Error(message);
  }

  return body as T;
}

export const ninjaApi = {
  getCat: () => request<Cat[]>(""),
};
