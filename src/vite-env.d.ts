/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  /** Set `"true"` to open the dashboard without logging in (temporary dev/demo). */
  readonly VITE_DASHBOARD_PUBLIC?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
