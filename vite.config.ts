import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    assetsInclude: ["**/*.sql"],
    optimizeDeps: {
        exclude: ["@electric-sql/pglite"],
    },
    server: {
        port: 5173,
        strictPort: true,
    },
    base: "./",
    build: {
        outDir: "dist/client",
    },
});
