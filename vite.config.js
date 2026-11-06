import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": "/src" },
  },
  server: {
    proxy: {
      // Proxy /api/* to the deployed Vercel project in local dev
      // Replace the target URL with your actual Vercel deployment URL
      "/api": {
        target: process.env.VITE_PROXY_URL || "https://plaid-com-pl.vercel.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
