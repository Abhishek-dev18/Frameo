import {fileURLToPath} from "node:url";
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

const api = "http://127.0.0.1:5174";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [react()],
  build: {outDir: "../dist-web", emptyOutDir: true},
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {"/api": api, "/videos": api, "/oauth": api},
  },
});
