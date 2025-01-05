import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      _components: "/src/components",
      _widgets: "/src/widgets",
      _features: "/src/features",
      _processed: "/src/processed",
      _shared: "/src/shared",
      _utils: "/src/utils",
      _configs: "/src/configs",
      _styles: "/src/styles",
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use \"_styles/_variables.scss\" as *;
          @use \"_styles/mixins/_mixins-block.scss\" as *;
          @use \"_styles/mixins/_mixins-font.scss\" as *;
          @use \"_styles/mixins/_mixins-utils.scss\" as *;
          @use \"_styles/functions/_functions-utils.scss\" as *;`,
      },
    },
  },

  build: {
    rollupOptions: {
      output: {
        /**
         * Использование более короткого словаря символов
         * - "base-64" - "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
         * - "base36" - "abcdefghijklmnopqrstuvwxyz0123456789"
         * https://rollupjs.org/configuration-options/#output-hashcharacters
         */
        hashCharacters: "base36",
        /**
         * Изменение имени файлов после билдна, на хэши
         * - chunkFileNames: чанки
         * - entryFileNames: входные js файлы
         * - assetFileNames: ассетов (CSS, изображения и т.д.)
         */
        chunkFileNames: "assets/[hash].js",
        entryFileNames: "assets/[hash].js",
        assetFileNames: "assets/[hash][extname]",
      },
    },
  },
});
