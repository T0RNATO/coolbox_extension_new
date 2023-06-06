import browser from "webextension-polyfill";
import "tailwindcss/tailwind.css"; // Add this line

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
      appRoot.appendChild(styleEl);
    });
  }

  document.querySelector("#component36911 > div > div > div > h2").replaceWith(appRoot);
  render(appRoot);
}
