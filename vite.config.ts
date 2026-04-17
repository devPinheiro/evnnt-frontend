import { resolve } from "node:path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const r = (p: string) => resolve(__dirname, "./src", p);

export default defineConfig({
  /** Load `src/.env` alongside the app (API URL, feature flags). */
  envDir: resolve(__dirname, "src"),
  plugins: [tanstackRouter({ target: "react" }), react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@ui": r("components/ui"),
      "@molecules": r("components/molecules"),
      "@organisms": r("components/organisms"),
      "@templates": r("components/templates"),
      "@hooks": r("hooks"),
      "@data": r("data"),
      "@utils": r("lib/utils.ts"),
      "@store": r("store/index.ts"),
      "@types": r("types/index.ts"),
      "@schemas": r("schemas"),
      "@pages": r("pages"),
      "@endpoints": r("lib/endpoints.ts"),
    },
  },
  server: {
    host: true,
    port: 3000,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
