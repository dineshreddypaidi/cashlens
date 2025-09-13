import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// });

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000', // only for local dev
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "static",
    rollupOptions: {
      output: {
        entryFileNames: "static/[name]-[hash].js",
        chunkFileNames: "static/[name]-[hash].js",
        assetFileNames: "static/[name]-[hash][extname]",
      },
    },
  },
});
