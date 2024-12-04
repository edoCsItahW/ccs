import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import { viteMockServe } from "vite-plugin-mock";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vitejs.dev/config/
export default defineConfig({
    esbuild: {
        target: "es2020"
    },
    css: {
        preprocessorOptions: {
            sass: {
                api: 'modern-compiler'
            }
        }
    },
    plugins: [
        vue({
            script: {
                babelParserPlugins: ["decoratorAutoAccessors"]
            }
        }),
        vueDevTools(),
        viteMockServe({
            mockPath: "./src/mock",
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    assetsInclude: ["**/*.svg"],
    server: {
        host: "0.0.0.0",
        port: 7265,
        open: true
    }
});
