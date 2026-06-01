# Las Muñecas de Ramón — Web pública

Sitio público de **Las Muñecas de Ramón** (hospedaje). Construido con [Astro](https://astro.build/).

Este proyecto es el **split del panel administrativo** (Next.js) en `../lasmunecasderamon-dashboard`. Acá vive únicamente la presencia pública del negocio: landing, términos y condiciones, política de privacidad.

## Stack

- **Astro 5** — output estático con adapter de Cloudflare para deploy en Pages
- **Tailwind CSS** — styling utilitario con tokens de marca
- **MDX** — para contenido editorial enriquecido
- **Sitemap** — generación automática
- **TypeScript estricto**

## Estructura

```
src/
  components/
    layout/   — Navbar, Footer
    ui/       — Container, Section, Button
  layouts/
    BaseLayout.astro   — <html>, <head>, Navbar, Footer, slot
  pages/      — Rutas (index, /terminos-y-condiciones, /politica-de-privacidad, 404)
  styles/
    global.css
  lib/
    seo.ts    — helpers de metadata
public/       — Assets estáticos (favicon, robots)
```

## Decisiones de arquitectura

- **Astro en vez de Next para el público**: la landing es 99% contenido estático editorial. Astro genera HTML plano con cero JS por defecto → mejor performance y SEO.
- **Cloudflare Pages**: deploy target. Edge network global, ideal para sitios públicos.
- **Sin React/Vue/Svelte**: el sitio no necesita interactividad. Si en el futuro se agrega un widget de reserva, se hace con un Astro Island.
- **i18n configurado pero single-locale (es-AR)**: la base está lista para agregar inglés/portugués sin refactor.
- **Brand tokens en `tailwind.config.mjs`**: la paleta (primary, accent, neutral) se redefine en un solo lugar.

## Contenido

El contenido real (textos, imágenes, legal) se migrará desde el panel admin en `../lasmunecasderamon-dashboard` en una iteración posterior. Las páginas actuales son placeholders con la estructura final.

## Comandos

```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo
pnpm dev
# → http://localhost:4321

# Build de producción (output en ./dist)
pnpm build

# Preview del build
pnpm preview

# Type-check + Astro diagnostics
pnpm check
```

## Deploy

El adapter `@astrojs/cloudflare` está configurado. Para deployar:

```bash
pnpm build
# Subir ./dist a Cloudflare Pages, o conectar el repo a Pages
# con build command = pnpm build y output = dist
```

Variables de entorno: ninguna requerida en esta primera versión.

## TODO (próximas iteraciones)

- [ ] Migrar contenido real de `app/page.tsx` y `app/landing/page.tsx` desde el admin
- [ ] Migrar textos legales finales
- [ ] Definir tipografía final (fuentes self-hosted)
- [ ] Refinar paleta de marca con dirección visual aprobada
- [ ] Conectar API de habitaciones/eventos cuando esté lista
- [ ] Agregar OG image real (actualmente placeholder)
