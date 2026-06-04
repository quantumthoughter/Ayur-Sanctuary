import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5174,
        proxy: {
            "/api": {
                target: "http://localhost:3457",
                changeOrigin: true,
            },
        },
    },
    resolve: {
        preserveSymlinks: true,
    },
});
//# sourceMappingURL=vite.config.js.map