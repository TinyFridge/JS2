import { resolve } from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import ViteRestart from "vite-plugin-restart";

export default defineConfig({
  plugins: [
    tailwindcss(),
    ViteRestart({
      restart: ["vite.config.js"],
    }),
  ],
  resolve: {
    alias: {
      "@api": resolve(__dirname, "src/js/api/post"),
      "@constants": resolve(__dirname, "src/js/api/constants.js"),
    },
  },
  appType: "mpa",
  base: "/",
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "index.html"),
        register: resolve(__dirname, "auth/register.html"),
        profile: resolve(__dirname, "profile/profile.html"),
        feed: resolve(__dirname, "feed/feed.html"),
      },
    },
  },
});
