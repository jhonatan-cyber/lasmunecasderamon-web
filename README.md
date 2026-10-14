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
- **Brand tokens en `tailwind.config.mjs`**: el sistema de diseño **Neon Nights** (paleta neón pink/cyan/violet sobre negro, tipografía display Anton + Space Grotesk, glows, grain, marquee) se redefine en un solo lugar. Se mantiene la paleta `gold` solo para páginas legales/404 heredadas.

## Contenido

El contenido real (textos, imágenes, legal) se migrará desde el panel admin en `../lasmunecasderamon-dashboard` en una iteración posterior. Las páginas actuales son placeholders con la estructura final.

## Fotos del club

Las fotos reales viven en `src/assets/photos/` (carpeta fuente, no se despliega) y el script `build:assets` genera variantes **WebP optimizadas** en `public/img/` con nombres descriptivos: `about-1-480.webp`, `events-2-800.webp`, `instagram-3-300.webp`, etc. Los componentes las consumen con `srcset`/`sizes` — ver [src/assets/photos/README.md](src/assets/photos/README.md) para la lista de slots y el flujo. Si falta una foto, el build genera un placeholder de marca con el logo (el sitio nunca queda con imágenes rotas ni depende de CDNs externos).

## Integración de Instagram

La sección de Instagram carga el feed real de `@lasmunecasderamon` vía un endpoint server (`/api/instagram`) usando la **Instagram API with Instagram Login** (`graph.instagram.com`). Sin token configurado, muestra imágenes ilustrativas (fallback silencioso).

**Setup (una vez):**

1. La cuenta de Instagram debe ser **Business o Creator**
2. Crear una app en [developers.facebook.com](https://developers.facebook.com) y agregar el producto **Instagram**
3. En *API setup with Instagram login*, generar un **access token long-lived** (60 días de validez) para la cuenta
4. Configurar la variable `INSTAGRAM_ACCESS_TOKEN` en el proyecto de Cloudflare Pages (*Settings → Environment variables*) y en `.env` para desarrollo local (ver `.env.example`)

**Renovación automática:** el endpoint refresca el token oportunista cada ~45 días mientras el sitio reciba visitas (los tokens duran 60). Si el sitio permanece sin tráfico más de 60 días, renovar el token manualmente desde el dashboard de Meta.

**Cache:** el feed se cachea 1 hora (memoria del worker) y la respuesta HTTP lleva `max-age=300` para CDNs.

## Comandos

```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo
pnpm dev
# → http://localhost:4321

# Build de producción (assets de marca + output en ./dist)
pnpm build

# Solo regenerar OG image, iconos PWA y variantes webp de logos
pnpm build:assets

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
- [x] Definir tipografía final (fuentes self-hosted via @fontsource: Anton + Space Grotesk)
- [x] Refinar paleta de marca: sistema **Neon Nights** (pink/cyan/violet sobre negro)
- [ ] Conectar API de habitaciones/eventos cuando esté lista
- [x] OG image real generada en build (`pnpm build:assets`) + iconos PWA
- [ ] Reemplazar imágenes placeholder de Unsplash por fotos reales del club
