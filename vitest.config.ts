import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      _widgets: "/src/widgets",
      _features: "/src/features",
      _entities: "/src/entities",
      _shared: "/src/shared",
      _processes: "/src/processes",
      _hooks: "/src/hooks",
      _utils: "/src/utils",
      _configs: "/src/configs",
      _types: "/src/types",
      _styles: "/src/styles",
    },
  },

  test: {
    include: ["./src/**/__tests__/*.{test,spec}.?(c|m)[jt]s?(x)"],
  },
});
