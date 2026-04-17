import { isDashboardPublicBypassPath } from "@/lib/dashboard-public";
import { useAuthStore } from "@/store/auth.store";
import type { ApiErrorBody, ApiSuccess } from "@types";
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "https://evvnt-staging.up.railway.app";

export const http = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

/** Plain client for refresh — avoids interceptor recursion. */
const bare = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

type RequestWithRetry = InternalAxiosRequestConfig & { _retry?: boolean };

function isPublicAuthPath(pathname: string): boolean {
  return (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup")
  );
}

/** Don’t force navigation to `/login` when already on a “safe” route (auth screens or public dashboard). */
function shouldSkipLoginRedirect(pathname: string): boolean {
  return isPublicAuthPath(pathname) || isDashboardPublicBypassPath(pathname);
}

function isAuthCredentialsRequest(url: string | undefined): boolean {
  if (!url) return false;
  return url.includes("/auth/login") || url.includes("/auth/signup");
}

function isRefreshRequest(url: string | undefined): boolean {
  return Boolean(url?.includes("/auth/refresh"));
}

function isApiErrorBody(x: unknown): x is ApiErrorBody {
  return (
    typeof x === "object" &&
    x !== null &&
    "ok" in x &&
    (x as ApiErrorBody).ok === false &&
    "error" in x &&
    typeof (x as ApiErrorBody).error?.message === "string"
  );
}

function rejectWithEnvelopeOrNetwork(err: AxiosError): Promise<never> {
  const payload = err.response?.data;
  if (payload !== undefined && isApiErrorBody(payload)) {
    return Promise.reject(new Error(payload.error.message));
  }
  if (axios.isAxiosError(err) && err.message) {
    return Promise.reject(
      new Error(
        err.message === "Network Error" ? "Network error — is the API running?" : err.message,
      ),
    );
  }
  return Promise.reject(err);
}

http.interceptors.request.use((config) => {
  const url = config.url ?? "";
  if (isAuthCredentialsRequest(url) || isRefreshRequest(url)) {
    config.headers.Authorization = undefined;
    return config;
  }
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest = err.config as RequestWithRetry | undefined;
    const status = err.response?.status;
    const payload = err.response?.data;

    if (status !== 401 || !originalRequest) {
      return rejectWithEnvelopeOrNetwork(err);
    }

    const url = originalRequest.url ?? "";

    if (isRefreshRequest(url)) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined" && !shouldSkipLoginRedirect(window.location.pathname)) {
        window.location.assign("/login");
      }
      return rejectWithEnvelopeOrNetwork(err);
    }

    if (!originalRequest._retry && !isAuthCredentialsRequest(url)) {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        originalRequest._retry = true;
        try {
          const { data: body } = await bare.post<
            ApiSuccess<{ tokens: { accessToken: string; refreshToken: string } }> | ApiErrorBody
          >("/api/v1/auth/refresh", { refreshToken });

          if (!body || typeof body !== "object" || !("ok" in body)) {
            throw new Error("Invalid refresh response");
          }
          if (!body.ok) {
            throw new Error(body.error.message);
          }

          const tokens = body.data.tokens;
          useAuthStore.getState().replaceTokens(tokens);

          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return http(originalRequest);
        } catch {
          useAuthStore.getState().logout();
          if (typeof window !== "undefined" && !shouldSkipLoginRedirect(window.location.pathname)) {
            window.location.assign("/login");
          }
          return rejectWithEnvelopeOrNetwork(err);
        }
      }
    }

    useAuthStore.getState().logout();
    if (typeof window !== "undefined" && !shouldSkipLoginRedirect(window.location.pathname)) {
      window.location.assign("/login");
    }

    if (payload !== undefined && isApiErrorBody(payload)) {
      return Promise.reject(new Error(payload.error.message));
    }

    if (axios.isAxiosError(err) && err.message) {
      return Promise.reject(
        new Error(
          err.message === "Network Error" ? "Network error — is the API running?" : err.message,
        ),
      );
    }

    return Promise.reject(err);
  },
);
