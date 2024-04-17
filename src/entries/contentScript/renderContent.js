import browser from "webextension-polyfill";

export default async function renderContent(render) {
    const appRoot = document.createElement("div");

    if (!import.meta.hot) {
        import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS.forEach((cssPath) => {
            const styleEl = document.createElement("link");
            styleEl.setAttribute("rel", "stylesheet");
            styleEl.setAttribute("href", browser.runtime.getURL(cssPath));
            document.head.appendChild(styleEl);
        });
    }

    document.querySelector("#container").appendChild(appRoot);
    render(appRoot);
}
