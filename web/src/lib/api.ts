export function getToken(): string | null {
  return localStorage.getItem("token");
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(path, { ...init, headers });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch {}

  if (!res.ok) {
    const msg = (data && (data.detail || data.message)) || text || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}
