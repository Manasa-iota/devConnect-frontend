const API_BASE = "http://localhost:3000";

export type Json = Record<string, unknown>;

export async function api<T = any>(
  path: string,
  opts: { method?: string; body?: Json | undefined; headers?: Record<string, string> } = {}
): Promise<T> {
  const { method = "GET", body, headers } = opts;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await res.json().catch(() => ({}))) as any;
  if (!res.ok || data?.success === false) {
    const msg = data?.message || data?.errors || "Request failed";
    throw new Error(typeof msg === "string" ? msg : "Request failed");
  }
  return data as T;
}
