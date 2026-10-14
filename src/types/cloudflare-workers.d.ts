/**
 * Tipos del módulo runtime de Cloudflare Workers (`cloudflare:workers`).
 *
 * En Astro 6 + @astrojs/cloudflare, las variables de entorno del worker se
 * leen con `import { env } from "cloudflare:workers"` (locals.runtime fue
 * eliminado). Si en el futuro se agrega @cloudflare/workers-types, estas
 * declaraciones complementarias se fusionan sin conflicto.
 */
declare module "cloudflare:workers" {
  export const env: Record<string, unknown>;
}
