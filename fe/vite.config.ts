import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // 현재 작업 디렉터리의 `mode`를 기반으로 env 파일을 불러옴
    const env = loadEnv(mode, process.cwd(), "");

    return {
        base: env.VITE_PUBLIC_URL,
        plugins: [react(), tailwindcss(), svgr()],
        server: {
            proxy: {
                "/api": {
                    target: "http://localhost:8090",
                    changeOrigin: true,
                    rewrite: (path: string) => path.replace(/^\/api/, ""),
                },
            },
        },
    };
});
