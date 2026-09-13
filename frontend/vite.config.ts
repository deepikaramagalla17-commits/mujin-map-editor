import react from '@vitejs/plugin-react'
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: { allow: [".."] },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
