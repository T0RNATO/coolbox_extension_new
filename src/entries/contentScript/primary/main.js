import { createApp } from "vue";
import renderContent from "../renderContent";
import App from "./Homepage.vue";
import "tailwindcss/tailwind.css";

if (location.pathname === "/") {
  renderContent(import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, (appRoot) => {
    createApp(App).mount(appRoot);
  });
}
