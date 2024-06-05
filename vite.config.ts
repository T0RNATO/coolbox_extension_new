import { defineConfig, loadEnv, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import webExtension from "@samrum/vite-plugin-web-extension";
import path from "path";
import { getManifest } from "./src/manifest.js";

// https://vitejs.dev/config/
// noinspection JSUnusedGlobalSymbols
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const isPatchRequired = Number(env.MANIFEST_VERSION) === 2;

    const firefoxPatch: Plugin = {
        name: 'firefox-patch',
        transform(code, path) {
            if (isPatchRequired && path.includes('node_modules/vue-shadow-dom')) {
                // language=js
                const patchedCode = code.replace("shadow_root.adoptedStyleSheets = adoptedStyleSheets;", `
                    shadow_root.adoptedStyleSheets.length = 0;
                    for (const sheet of adoptedStyleSheets) {
                        const cssText = Array.prototype.map.call(sheet.cssRules, rule => rule.cssText).join('\\n');
                        shadow_root.innerHTML += \`<style>\${cssText}</style>\`;
                    }
                `);
                return {
                    code: patchedCode,
                    map: null,
                };
            }
            return null;
        },
    };

    return {
        plugins: [
            vue(),
            webExtension({
                manifest: getManifest(Number(env.MANIFEST_VERSION)),
            }),
            firefoxPatch,
        ],
        resolve: {
            alias: {
                "~": path.resolve(__dirname, "./src"),
            },
        },
    };
});