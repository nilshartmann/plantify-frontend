/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import tanstackRouter from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";

const BACKEND_URL = "http://localhost:8180";

console.log(` 🌱 Using Backend at ${BACKEND_URL}`);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    // https://tailwindcss.com/docs/installation/using-vite
    tailwindcss(),
    react(),
  ],
  server: {
    host: "0.0.0.0",
    port: 9080,
    proxy: {
      "/api": BACKEND_URL,
    },
  },
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["src/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          include: ["src/**/*.{browsertest,spec}.?(c|m)[jt]s?(x)"],
          browser: {
            enabled: true,
            provider: playwright(),
            // https://vitest.dev/guide/browser/playwright
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
