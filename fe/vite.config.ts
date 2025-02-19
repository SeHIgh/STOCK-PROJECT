import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
    base: "",
    plugins: [react(), tailwindcss(), svgr()],
    server: {
        proxy: {
            "/api": {
                target: "env.VITE_API_BASE_URL",
                changeOrigin: true,
            },
        },
    },
});
