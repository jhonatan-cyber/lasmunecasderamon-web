# Fotos del club — originales

Coloca aquí las **fotos reales** del club con estos nombres exactos (`.jpg`, `.jpeg`, `.png` o `.webp`):

## Slider "Sobre Nosotros" (relación 3:2, ideal ≥1600px de ancho)

| Archivo   | Contenido esperado      |
| --------- | ----------------------- |
| `about-1` | Instalaciones del local |
| `about-2` | Ambiente / iluminación  |
| `about-3` | Bar y coctelería        |
| `about-4` | Salas VIP               |

## Slider "Eventos" (relación 3:2, ideal ≥1600px de ancho)

| Archivo    | Contenido esperado      |
| ---------- | ----------------------- |
| `events-1` | Despedidas de soltero   |
| `events-2` | Fiestas privadas        |
| `events-3` | Quincho / asado privado |
| `events-4` | Eventos VIP             |

## Grid de Instagram (cuadradas 1:1, ideal ≥800px)

| Archivo      | Contenido esperado         |
| ------------ | -------------------------- |
| `instagram-1` … `instagram-6` | Momentos del club (se reemplazan solas cuando el feed real está configurado) |

## Galería

La sección **Galería** (`#galeria`) reutiliza los 14 slots de esta carpeta: los 8 horizontales
(`about-*`, `events-*`) y los 6 cuadrados (`instagram-*`), con lightbox a tamaño completo.

## Flujo

1. Suelta las fotos en esta carpeta con los nombres de arriba (si falta alguna, el build genera un placeholder de marca automáticamente).
2. Ejecuta `pnpm build:assets` (o `pnpm build`, que lo incluye).
3. El script genera variantes **WebP optimizadas** en `public/img/`:
   - Sliders: `about-1-480.webp`, `about-1-800.webp`, `about-1-1200.webp`, …
   - Instagram: `instagram-1-300.webp`, `instagram-1-600.webp`, …
4. Los componentes ya apuntan a `/img/<nombre>-<ancho>.webp` con `srcset`/`sizes` — no hay que tocar código.

> Esta carpeta **no se despliega**: solo los WebP optimizados de `public/img/` llegan a producción.
