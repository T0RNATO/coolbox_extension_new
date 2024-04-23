import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import webExtension from "@samrum/vite-plugin-web-extension";
// noinspection NodeCoreCodingAssistance
import path from "path";
// noinspection ES6PreferShortImport, cannot use short import in the file that defines it.
import { getManifest } from "./src/manifest";

// https://vitejs.dev/config/
// noinspection JSUnusedGlobalSymbols
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [
            vue(),
            webExtension({
                manifest: getManifest(Number(env.MANIFEST_VERSION)),
            }),
        ],
        resolve: {
            alias: {
                "~": path.resolve(__dirname, "./src"),
            },
        },
    };
});