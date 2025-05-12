// @ts-ignore
import pkg from "../package.json";

const sharedManifest: Partial<chrome.runtime.Manifest> = {
    content_scripts: [
        {
            js: ["src/entries/pages/all_pages.js"],
            css: [
                "src/assets/css/icons.css",
                "src/assets/css/global_css.css",
            ],
            matches: ["*://schoolbox.donvale.vic.edu.au/*"],
        },
        {
            js: ["src/entries/pages/homepage/beforePageLoad.js"],
            matches: ["*://schoolbox.donvale.vic.edu.au/*"],
            run_at: "document_start",
        },
        {
            css: ["src/assets/css/homepage.css"],
            matches: ["*://schoolbox.donvale.vic.edu.au/"],
        },
        {
            css: ["src/assets/css/news_item.css"],
            matches: ["*://schoolbox.donvale.vic.edu.au/news/*"],
        },
        {
            css: ["src/entries/pages/calendar/calendar.css"],
            matches: [
                "*://schoolbox.donvale.vic.edu.au/coolbox-calendar",
                "*://schoolbox.donvale.vic.edu.au/coolbox-todo",
            ],
        }
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
    ] ,
    options_ui: {
        page: "src/entries/options/index.html",
        open_in_tab: true
    }
};

const browserAction = {
    default_icon: {
        64: "icons/icon.png"
    },
    default_popup: "src/entries/popup/index.html",
};

const ManifestV2: Partial<chrome.runtime.ManifestV2> = {
    manifest_version: 2,
    background: {
        scripts: ["src/entries/background/serviceWorker.ts"],
        persistent: true,
    },
    browser_action: browserAction,
    options_ui: {
        ...sharedManifest.options_ui,
        chrome_style: false,
    },
    permissions: [
        ...sharedManifest.permissions,
        "*://schoolbox.donvale.vic.edu.au/*",
        "*://api.coolbox.lol/*",
    ],
    web_accessible_resources: ["/fonts/icons.woff2"]
};

const ManifestV3: Partial<chrome.runtime.ManifestV3> = {
    manifest_version: 3,
    action: browserAction,
    background: {
        service_worker: "src/entries/background/serviceWorker.ts",
    },
    host_permissions: ["*://schoolbox.donvale.vic.edu.au/*"],
    web_accessible_resources: [
        {
            resources: ["/fonts/icons.woff2"],
            matches: ["*://schoolbox.donvale.vic.edu.au/*"],
        }
    ]
};

export function getManifest(manifestVersion: number): chrome.runtime.Manifest {
    const manifest = {
        ...sharedManifest,
        author: pkg.author,
        description: pkg.description,
        name: pkg.displayName ?? pkg.name,
        version: pkg.version,
    };

    if (manifestVersion === 2) {
        return {
            ...manifest,
            ...ManifestV2,
        } as chrome.runtime.ManifestV2;
    }

    if (manifestVersion === 3) {
        return {
            ...manifest,
            ...ManifestV3,
        } as chrome.runtime.ManifestV3;
    }

    throw new Error(
        `Missing manifest definition for manifestVersion ${manifestVersion}`
    );
}
