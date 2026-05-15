import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sanity from "@sanity/astro";

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  site: "https://amar-aziz-nettside.vercel.app",
  i18n: {
    defaultLocale: "no",
    locales: ["no", "en"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap(),
    sanity({
      projectId,
      dataset,
      useCdn: true,
      apiVersion: "2024-10-01",
      studioBasePath: "/studio",
      studioRouterHistory: "hash",
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});