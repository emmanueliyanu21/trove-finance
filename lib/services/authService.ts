const SIMULATED_LATENCY_MS = 900;
const SESSION_KEY = "trove.session";

function setCookie(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0`;
}

export async function login(email: string, password: string): Promise<{ name: string }> {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  const name = email.split("@")[0] || "Investor";
  if (typeof window !== "undefined") {
    setCookie(SESSION_KEY, name);
  }
  return { name };
}

export function getSession(): string | null {
  if (typeof window === "undefined") return null;
  return getCookie(SESSION_KEY);
}

export function logout(): void {
  if (typeof window === "undefined") return;
  deleteCookie(SESSION_KEY);
}
