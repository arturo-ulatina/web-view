import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The API has no CORS, so the dev server forwards /api/* to it instead.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
