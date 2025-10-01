export type CookieOptions = {
  days?: number;
  path?: string;
  sameSite?: "lax" | "strict" | "none";
  secure?: boolean;
};

export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  const { days, path = "/", sameSite = "lax", secure } = options;
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=${path}; SameSite=${sameSite}`;
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  if (secure ?? isHttps) cookie += "; Secure";
  if (typeof days === "number") {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    cookie += `; Expires=${date.toUTCString()}`;
  }
  document.cookie = cookie;
}

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

export function deleteCookie(name: string, path = "/"): void {
  document.cookie = `${encodeURIComponent(name)}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}

export function getAllCookieNames(): string[] {
  if (typeof document === "undefined") return [];
  return document.cookie
    .split(";")
    .map((c) => c.split("=")[0]?.trim())
    .filter(Boolean) as string[];
}

export function deleteAuthCookies(): void {
  const names = getAllCookieNames();
  const authLike = new Set([
    "auth_token",
    "authToken",
    "token",
    "refresh_token",
    "access_token",
    "id_token",
    "isOtpVerified",
  ]);
  names.forEach((n) => {
    if (authLike.has(n) || /token|auth|otp/i.test(n)) {
      try { deleteCookie(n); } catch {}
    }
  });
}
