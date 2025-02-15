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
                target: "https://wts-cert-api.tossinvest.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
                secure: true, // HTTPS를 사용할 경우 true로 설정
            },
        },
    },
});
