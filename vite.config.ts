/// <reference types="vite-react-ssg" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    // GitHub Pages serves static files only: `nested` emits `path/index.html`
    // for every route, so deep links work without a server rewrite rule.
    ssgOptions: {
        dirStyle: "nested",
        formatting: "none",
        script: "async",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
