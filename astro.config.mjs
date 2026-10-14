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
    sitemap({
      // /landing es noindex (duplicado de /) — no debe estar en el sitemap
      filter: (page) => !page.includes("/landing"),
      serialize: (item) => ({
        ...item,
        lastmod: item.lastmod ?? new Date().toISOString().slice(0, 10),
        changefreq: item.url.endsWith("/") ? "weekly" : "monthly",
        priority: new URL(item.url).pathname === "/" ? 1.0 : 0.4,
      }),
    }),
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
