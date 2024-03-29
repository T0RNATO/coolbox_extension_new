import pkg from "../package.json";

const sharedManifest = {
    content_scripts: [
        {
            js: ["src/entries/contentScript/homepage/main.js"],
            css: [
                "src/assets/css/icons.css",
                "src/assets/css/all_pages.css",
            ],
            matches: ["*://schoolbox.donvale.vic.edu.au/*"],
        },
        {
            js: ["src/entries/contentScript/homepage/beforePageLoad.js"],
            matches: ["*://schoolbox.donvale.vic.edu.au/*"],
            run_at: "document_start",
        },
        {
            css: ["src/assets/css/homepage.css"],
            matches: ["*://schoolbox.donvale.vic.edu.au/"],
        },
    ],
    icons: {
        64: "icons/icon.png"
    },
    permissions: [
        "storage",
        "scripting",
        "cookies",
        "notifications",
        "alarms",
    ],
};

const browserAction = {
    default_icon: {
        64: "icons/icon.png"
    },
    default_popup: "src/entries/popup/index.html",
};

const ManifestV2 = {
    ...sharedManifest,
    background: {
        scripts: ["src/entries/background/serviceWorker.ts"],
        persistent: true,
    },
    browser_action: browserAction,
    // options_ui: {
    //     ...sharedManifest.options_ui,
    //     chrome_style: false,
    // },
    permissions: [...sharedManifest.permissions, "*://schoolbox.donvale.vic.edu.au/*"],
};

const ManifestV3 = {
    ...sharedManifest,
    action: browserAction,
    background: {
        service_worker: "src/entries/background/serviceWorker.ts",
    },
    host_permissions: ["*://schoolbox.donvale.vic.edu.au/*"],
};

export function getManifest(manifestVersion) {
    const manifest = {
        author: pkg.author,
        description: pkg.description,
        name: pkg.displayName ?? pkg.name,
        version: pkg.version,
    };

    if (manifestVersion === 2) {
        return {
            ...manifest,
            ...ManifestV2,
            manifest_version: manifestVersion,
        };
    }

    if (manifestVersion === 3) {
        return {
            ...manifest,
            ...ManifestV3,
            manifest_version: manifestVersion,
        };
    }

    throw new Error(
        `Missing manifest definition for manifestVersion ${manifestVersion}`
    );
}
