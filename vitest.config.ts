import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
    coverage: {
      provider: "v8",
      include: [
        "src/lib/**/*.ts",
        "src/stores/**/*.ts",
        "src/hooks/**/*.ts",
        "src/data/getCardsByDeck.ts",
      ],
      exclude: [
        "src/lib/index.ts",
        "src/hooks/index.ts",
        "src/**/*.test.*",
      ],
      thresholds: {
        lines: 75,
        functions: 60,
        branches: 60,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
