#!/usr/bin/env node
/**
 * Build the Open Graph image (1200x630) used for social link previews.
 * Renders the entire composition as a single SVG (logo embedded as base64
 * PNG), then rasterizes to PNG + WebP with sharp. Single-pass approach
 * avoids multi-layer composition quirks.
 *
 * Run with: pnpm build:og
 */
import sharp from "sharp";
import { readFile, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const publicDir = join(projectRoot, "public");
const logoPath = join(publicDir, "img", "system", "logo2.png");

const WIDTH = 1200;
const HEIGHT = 630;

try {
  await access(logoPath);
} catch {
  console.error(`Logo not found at ${logoPath}`);
  process.exit(1);
}

const logoBuffer = await readFile(logoPath);
const logoMeta = await sharp(logoBuffer).metadata();
const logoBase64 = logoBuffer.toString("base64");
console.log(`Logo: ${logoMeta.width}x${logoMeta.height} ${logoMeta.format}`);

// Compute logo placement — keep aspect ratio, fit within max bounds
const logoMaxWidth = 720;
const logoMaxHeight = 360;
const logoAspect = (logoMeta.width ?? 1) / (logoMeta.height ?? 1);
let logoDrawWidth = logoMaxWidth;
let logoDrawHeight = logoDrawWidth / logoAspect;
if (logoDrawHeight > logoMaxHeight) {
  logoDrawHeight = logoMaxHeight;
  logoDrawWidth = logoDrawHeight * logoAspect;
}
const logoX = (WIDTH - logoDrawWidth) / 2;
const logoY = 110; // top-area positioning

const taglineY = logoY + logoDrawHeight + 50;
const locationY = taglineY + 48;
const hoursY = locationY + 32;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="50%" stop-color="#000000"/>
      <stop offset="100%" stop-color="#0a0606"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="38%" r="55%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.22"/>
      <stop offset="40%" stop-color="#d97706" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
      <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
    </radialGradient>
    <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#eac857"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0"/>
      <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>

  <!-- Corner gold accents -->
  <g stroke="#f59e0b" stroke-opacity="0.45" stroke-width="2" fill="none">
    <line x1="50" y1="50" x2="140" y2="50"/>
    <line x1="50" y1="50" x2="50" y2="140"/>
    <line x1="${WIDTH - 50}" y1="${HEIGHT - 50}" x2="${WIDTH - 140}" y2="${HEIGHT - 50}"/>
    <line x1="${WIDTH - 50}" y1="${HEIGHT - 50}" x2="${WIDTH - 50}" y2="${HEIGHT - 140}"/>
  </g>

  <!-- Decorative gold horizontal lines flanking the logo -->
  <rect x="80" y="${logoY + logoDrawHeight / 2 - 1}" width="160" height="2" fill="url(#goldLine)"/>
  <rect x="${WIDTH - 240}" y="${logoY + logoDrawHeight / 2 - 1}" width="160" height="2" fill="url(#goldLine)"/>

  <!-- Logo (embedded PNG, preserves alpha) -->
  <image
    x="${logoX}" y="${logoY}"
    width="${logoDrawWidth}" height="${logoDrawHeight}"
    href="data:image/png;base64,${logoBase64}"
    preserveAspectRatio="xMidYMid meet"
  />

  <!-- Eyebrow chip -->
  <g transform="translate(${WIDTH / 2}, ${taglineY - 38})">
    <rect x="-160" y="-22" width="320" height="44" rx="22" ry="22"
          fill="#f59e0b" fill-opacity="0.10" stroke="#f59e0b" stroke-opacity="0.50" stroke-width="1.5"/>
    <text x="0" y="6" text-anchor="middle"
          font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
          font-size="17" font-weight="600" letter-spacing="3" fill="#f59e0b">
      NIGHTCLUB EXCLUSIVO
    </text>
  </g>

  <!-- Tagline -->
  <text x="${WIDTH / 2}" y="${taglineY + 12}" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="42" font-weight="700" fill="url(#goldText)">
    Vive la experiencia VIP
  </text>

  <!-- Location -->
  <text x="${WIDTH / 2}" y="${locationY + 8}" text-anchor="middle"
        font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        font-size="20" font-weight="500" fill="#cbd5e1" letter-spacing="1.5">
    Linares, Región del Maule · Chile
  </text>

  <!-- Hours -->
  <text x="${WIDTH / 2}" y="${hoursY + 8}" text-anchor="middle"
        font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        font-size="14" font-weight="600" fill="#94a3b8" letter-spacing="3">
    MARTES A DOMINGO · 22:00 — 05:00 HRS
  </text>

  <!-- Vignette overlay (last) -->
  <rect width="100%" height="100%" fill="url(#vignette)"/>
</svg>`;

const svgBuffer = Buffer.from(svg, "utf8");

const pngBuffer = await sharp(svgBuffer, { density: 96 })
  .png({ compressionLevel: 9, palette: false })
  .toBuffer();
const webpBuffer = await sharp(pngBuffer).webp({ quality: 90 }).toBuffer();

const pngOut = join(publicDir, "og-image.png");
const webpOut = join(publicDir, "og-image.webp");

await writeFile(pngOut, pngBuffer);
await writeFile(webpOut, webpBuffer);

console.log(`Wrote ${pngOut} — 1200x630 ${(pngBuffer.length / 1024).toFixed(1)} KB`);
console.log(`Wrote ${webpOut} — 1200x630 ${(webpBuffer.length / 1024).toFixed(1)} KB`);
