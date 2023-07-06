import { createApp } from "vue";
import renderContent from "../renderContent";
import App from "./Homepage.vue";
import "tailwindcss/tailwind.css";
import shadow from 'vue-shadow-dom'

if (location.pathname === "/") {
    renderContent(import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, (appRoot) => {
        const app= createApp(App);
        app.use(shadow);
        app.mount(appRoot);
    });
}