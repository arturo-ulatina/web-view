import type { User, UserInput } from "./types";

const BASE_URL = "/api/users";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(BASE_URL + path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
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

export const usersApi = {
  list: () => request<User[]>(""),
  create: (user: UserInput) =>
    request<User>("", { method: "POST", body: JSON.stringify(user) }),
  update: (id: number, user: Partial<UserInput>) =>
    request<User>(`/${id}`, { method: "PUT", body: JSON.stringify(user) }),
  remove: (id: number) => request<User>(`/${id}`, { method: "DELETE" }),
};
