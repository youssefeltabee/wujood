import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    css: { modules: { classNameStrategy: "non-scoped" } },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // lenis/react dist file missing from installed package — use stub
      "lenis/react": path.resolve(__dirname, "./src/test/__mocks__/lenis-react.tsx"),
    },
  },
});
