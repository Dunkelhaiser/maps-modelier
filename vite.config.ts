import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    preview: {
        port: 5173,
        strictPort: true,
    },
    server: {
        port: 5173,
        strictPort: true,
        host: true,
        origin: "http://0.0.0.0:5173",
    },
});
