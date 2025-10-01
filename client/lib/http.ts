import axios, { AxiosError, AxiosInstance, Method } from "axios";
import { getCookie, setCookie, deleteCookie } from "./cookies";

export const API_BASE_URL: string =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL) ||
  "http://192.168.1.74:8081";

const REFRESH_URL = "/api/admin/auth/refresh-token";

function isAbsoluteUrl(url: string): boolean {
  return /^(?:[a-z]+:)?\/\//i.test(url);
}

export type RequestOptions = {
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: any;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
  mode?: RequestMode;
  cache?: RequestCache;
};

let axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Single-flight for refresh requests
let refreshingPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getCookie("refresh_token");
  if (!refreshToken) return null;

  if (!refreshingPromise) {
    // Use a bare axios instance to avoid interceptor recursion
    const bare = axios.create({ baseURL: API_BASE_URL });
    refreshingPromise = bare
      .post(REFRESH_URL, undefined, {
        headers: { Authorization: `Bearer ${refreshToken}` },
        withCredentials: false,
      })
      .then((res) => {
        const data: any = res?.data ?? {};
        const access: string | undefined = data?.data?.accessToken || data?.accessToken;
        const newRefresh: string | undefined = data?.data?.refreshToken || data?.refreshToken;
        if (access) setCookie("access_token", access, { days: 365 });
        if (newRefresh) setCookie("refresh_token", newRefresh, { days: 365 });
        return access ?? null;
      })
      .catch(() => {
        return null;
      })
      .finally(() => {
        refreshingPromise = null;
      });
  }

  return refreshingPromise;
}

function attachInterceptors(instance: AxiosInstance) {
  // CSRF endpoint for obtaining token
  const CSRF_URL = "/api/auth/csrf";
  // Single-flight for CSRF fetches
  let csrfPromise: Promise<{ token: string | null; headerName: string } | null> | null = null;

  async function fetchCsrfTokenOnce(): Promise<{ token: string | null; headerName: string } | null> {
    const defaultHeader = "X-XSRF-TOKEN";
    const existing = getCookie(defaultHeader);
    if (existing) return { token: existing, headerName: defaultHeader };
    if (!csrfPromise) {
      const bare = axios.create({ baseURL: API_BASE_URL });
      csrfPromise = bare
        .get(CSRF_URL, { withCredentials: false })
        .then((res) => {
          const data: any = res?.data ?? {};
          const token = data?.token || data?.data?.token || data?._csrf || data?.data?._csrf || null;
          const headerName = data?.headerName || defaultHeader;
          if (token) {
            try { setCookie(headerName, token, { days: 1 }); } catch {}
          }
          return { token, headerName } as { token: string | null; headerName: string };
        })
        .catch(() => null)
        .finally(() => {
          csrfPromise = null;
        });
    }
    return csrfPromise;
  }

  instance.interceptors.request.use(async (config) => {
    // Attach auth token if available and not explicitly provided
    const existingAuth = (config.headers as any)?.Authorization as string | undefined;
    if (!existingAuth) {
      const token = getCookie("access_token") || getCookie("auth_token");
      if (token) {
        if (!config.headers) config.headers = {} as any;
        (config.headers as any)["Authorization"] = `Bearer ${token}`;
      }
    }

    // Attach CSRF token for unsafe methods
    const method = (config.method || "GET").toString().toUpperCase();
    const isUnsafe = !["GET", "HEAD", "OPTIONS"].includes(method);
    if (isUnsafe && typeof config?.url === "string" && !config.url.includes(CSRF_URL) && !config.url.includes(REFRESH_URL)) {
      const defaultHeader = "X-XSRF-TOKEN";
      const headersLower = Object.keys(config.headers || {}).reduce((acc: any, k) => {
        acc[k.toLowerCase()] = (config.headers as any)[k];
        return acc;
      }, {} as Record<string, any>);
      const hasHeader = !!headersLower[defaultHeader.toLowerCase()];
      if (!hasHeader) {
        // Try to read the cookie; if missing, fetch it from server
        let token = getCookie(defaultHeader);
        let headerName = defaultHeader;
        if (!token) {
          const fetched = await fetchCsrfTokenOnce();
          token = fetched?.token ?? null;
          headerName = fetched?.headerName ?? defaultHeader;
        }
        if (token) {
          if (!config.headers) config.headers = {} as any;
          (config.headers as any)[headerName] = token;
        }
      }
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const data = error.response?.data as any;
      const serverMsg = typeof data === "object" && data ? (data as any).message : undefined;
      const message = serverMsg || error.message || `Request failed with ${status ?? "error"}`;

      const originalConfig: any = error.config || {};

      const shouldAttemptRefresh =
        (status === 401 || status === 403) &&
        !originalConfig?._retry &&
        typeof originalConfig?.url === "string" &&
        !originalConfig.url.includes(REFRESH_URL);

      if (shouldAttemptRefresh) {
        originalConfig._retry = true;
        try {
          const newAccess = await refreshAccessToken();
          if (newAccess) {
            if (!originalConfig.headers) originalConfig.headers = {};
            originalConfig.headers.Authorization = `Bearer ${newAccess}`;
            return instance.request(originalConfig);
          }
        } catch {}
        // Refresh failed: cleanup and redirect to login if in browser
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        deleteCookie("auth_token");
        if (typeof window !== "undefined") {
          try { window.localStorage.removeItem("remember_me"); } catch {}
          if (!/\/login($|\?)/.test(window.location.pathname)) {
            window.location.replace("/login");
          }
        }
      }

      const err = new Error(message) as Error & { status?: number; data?: any };
      err.status = status;
      err.data = data;
      return Promise.reject(err);
    }
  );
}

attachInterceptors(axiosInstance);

async function request<T>(method: Method, path: string, options: RequestOptions = {}): Promise<T> {
  const { headers = {}, body, query, signal, credentials } = options;
  const url = isAbsoluteUrl(path) ? path : path; // absolute URLs bypass baseURL automatically

  const response = await axiosInstance.request<T>({
    url,
    method,
    params: query as any,
    data: body,
    headers,
    signal,
    withCredentials: credentials === "include",
  });
  return response.data as T;
}

export const api = {
  baseUrl: API_BASE_URL,
  setBaseUrl(url: string) {
    (api as any).baseUrl = url;
    axiosInstance = axios.create({ baseURL: url });
    attachInterceptors(axiosInstance);
  },
  get: <T>(path: string, options?: Omit<RequestOptions, "body">) => request<T>("GET", path, options as RequestOptions),
  post: <T>(path: string, options?: RequestOptions) => request<T>("POST", path, options),
  put: <T>(path: string, options?: RequestOptions) => request<T>("PUT", path, options),
  patch: <T>(path: string, options?: RequestOptions) => request<T>("PATCH", path, options),
  delete: <T>(path: string, options?: Omit<RequestOptions, "body">) => request<T>("DELETE", path, options as RequestOptions),
};

export default api;
