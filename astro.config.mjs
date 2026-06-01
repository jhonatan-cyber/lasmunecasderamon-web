import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

// Las Muñecas de Ramón — sitio público
// Deploy: Cloudflare Pages
// URL: https://lasmuñecasderamon.com/
// Admin lives on a separate subdomain (admin.lasmuñecasderamon.com)
export default defineConfig({
  site: "https://lasmuñecasderamon.com",
  output: "static",
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [
    tailwind({ applyBaseStyles: true }),
    mdx(),
    sitemap(),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  i18n: {
    defaultLocale: "es",
    locales: ["es"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    build: {
      cssCodeSplit: true,
    },
  },
});
