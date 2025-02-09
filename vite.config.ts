import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/** @type {import('vite').UserConfig} */
export default defineConfig({
	plugins: [react(), tailwindcss()],

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
		modules: {
			generateScopedName: "[hash:base36:5]",
		},
	},

	build: {
		rollupOptions: {
			input: {
				main: "index.html",
				sw: "src/processes/serviceWorker/sw.ts",
			},
			output: {
				hashCharacters: "base36",
				chunkFileNames: "assets/[hash].js",
				entryFileNames: ({ name: entryName }) =>
					entryName === "sw" ? "[name].js" : "assets/[hash].js",
				assetFileNames: "assets/[hash][extname]",
			},
		},
	},
});
