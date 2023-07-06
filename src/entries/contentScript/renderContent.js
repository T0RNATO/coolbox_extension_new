import browser from "webextension-polyfill";

export default async function renderContent(
    cssPaths,
    render = (_appRoot) => {}
) {
    const appRoot = document.createElement("div");

    if (import.meta.hot) {
        const { addViteStyleTarget } = await import(
            "@samrum/vite-plugin-web-extension/client"
            );

        await addViteStyleTarget(document.head);
    } else {
        cssPaths.forEach((cssPath) => {
            const styleEl = document.createElement("link");
            styleEl.setAttribute("rel", "stylesheet");
            styleEl.setAttribute("href", browser.runtime.getURL(cssPath));
            document.head.appendChild(styleEl);
        });
    }

    document.querySelector("#content").style.display = "none"
    document.querySelector("#container").appendChild(appRoot);

    render(appRoot);
}
