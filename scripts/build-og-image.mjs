#!/usr/bin/env node
/**
 * Generates brand assets for the site:
 *
 * 1. Open Graph image (1200x630 PNG + WebP) — Neon Nights branding
 * 2. PWA icons (192 / 512 / maskable-512) from the square logo
 *
 * The OG composition is rendered as a single SVG (logo embedded as base64),
 * then rasterized with sharp.
 *
 * Run with: pnpm build:og
 */
import sharp from "sharp";
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const publicDir = join(projectRoot, "public");
const logoPath = join(projectRoot, "src", "assets", "system", "logo2.png");
const iconLogoPath = join(projectRoot, "src", "assets", "system", "logo1.png");
const iconsDir = join(publicDir, "icons");

const WIDTH = 1200;
const HEIGHT = 630;

try {
  await access(logoPath);
  await access(iconLogoPath);
} catch {
  console.error(`Logo assets not found (expected ${logoPath} and ${iconLogoPath})`);
  process.exit(1);
}

const logoBuffer = await readFile(logoPath);
const logoMeta = await sharp(logoBuffer).metadata();
const logoBase64 = logoBuffer.toString("base64");
console.log(`Logo: ${logoMeta.width}x${logoMeta.height} ${logoMeta.format}`);

// ── Logo placement ──────────────────────────────────────────────
const logoMaxWidth = 640;
const logoMaxHeight = 320;
const logoAspect = (logoMeta.width ?? 1) / (logoMeta.height ?? 1);
let logoDrawWidth = logoMaxWidth;
let logoDrawHeight = logoDrawWidth / logoAspect;
if (logoDrawHeight > logoMaxHeight) {
  logoDrawHeight = logoMaxHeight;
  logoDrawWidth = logoDrawHeight * logoAspect;
}
const logoX = (WIDTH - logoDrawWidth) / 2;
const logoY = 96;

const taglineY = logoY + logoDrawHeight + 78;
const hoursY = taglineY + 58;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e8ca6a"/>
      <stop offset="45%" stop-color="#ddb349"/>
      <stop offset="100%" stop-color="#c3cad6"/>
    </linearGradient>
    <linearGradient id="divider" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ddb349" stop-opacity="0"/>
      <stop offset="50%" stop-color="#ddb349" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#b07d3a" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="glowPink" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ddb349" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#ddb349" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowViolet" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#b07d3a" stop-opacity="0.26"/>
      <stop offset="100%" stop-color="#b07d3a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowCyan" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c3cad6" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#c3cad6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
      <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
    </radialGradient>
    <pattern id="grid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ddb349" stroke-opacity="0.10" stroke-width="1"/>
    </pattern>
    <linearGradient id="gridFade" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.15"/>
    </linearGradient>
    <mask id="gridMask">
      <rect width="100%" height="100%" fill="url(#gridFade)"/>
    </mask>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="#050505"/>
  <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridMask)"/>
  <ellipse cx="200" cy="80" rx="480" ry="300" fill="url(#glowPink)"/>
  <ellipse cx="1050" cy="220" rx="440" ry="300" fill="url(#glowViolet)"/>
  <ellipse cx="500" cy="640" rx="500" ry="260" fill="url(#glowCyan)"/>

  <!-- Corner gold accents -->
  <g stroke="#ddb349" stroke-opacity="0.6" stroke-width="2.5" fill="none">
    <line x1="50" y1="50" x2="150" y2="50"/>
    <line x1="50" y1="50" x2="50" y2="150"/>
    <line x1="${WIDTH - 50}" y1="${HEIGHT - 50}" x2="${WIDTH - 150}" y2="${HEIGHT - 50}"/>
    <line x1="${WIDTH - 50}" y1="${HEIGHT - 50}" x2="${WIDTH - 50}" y2="${HEIGHT - 150}"/>
  </g>

  <!-- Logo (embedded PNG, preserves alpha) -->
  <image
    x="${logoX}" y="${logoY}"
    width="${logoDrawWidth}" height="${logoDrawHeight}"
    href="data:image/png;base64,${logoBase64}"
    preserveAspectRatio="xMidYMid meet"
  />

  <!-- Location chip -->
  <g transform="translate(${WIDTH / 2}, ${taglineY - 52})">
    <rect x="-190" y="-24" width="380" height="44" rx="22" ry="22"
          fill="#c3cad6" fill-opacity="0.08" stroke="#c3cad6" stroke-opacity="0.55" stroke-width="1.5"/>
    <text x="0" y="6" text-anchor="middle"
          font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
          font-size="16" font-weight="700" letter-spacing="4" fill="#dde2ea">
      LINARES · REGIÓN DEL MAULE
    </text>
  </g>

  <!-- Tagline -->
  <text x="${WIDTH / 2}" y="${taglineY + 14}" text-anchor="middle"
        font-family="'Arial Black', 'Segoe UI', system-ui, sans-serif"
        font-size="46" font-weight="900" letter-spacing="2" fill="url(#goldText)">
    LA NOCHE TE PERTENECE
  </text>

  <!-- Divider -->
  <rect x="${WIDTH / 2 - 180}" y="${hoursY - 26}" width="360" height="2" fill="url(#divider)"/>

  <!-- Hours -->
  <text x="${WIDTH / 2}" y="${hoursY + 6}" text-anchor="middle"
        font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        font-size="15" font-weight="600" fill="#9aa3b2" letter-spacing="4">
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

// ── PWA icons from the square logo ──────────────────────────────
await mkdir(iconsDir, { recursive: true });
const iconLogoBuffer = await readFile(iconLogoPath);

async function makeIcon(size, logoScale, outName) {
  const resized = await sharp(iconLogoBuffer)
    .resize(Math.round(size * logoScale), Math.round(size * logoScale), {
      fit: "inside",
    })
    .png()
    .toBuffer();

  const out = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: "#050505",
    },
  })
    .composite([{ input: resized, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  const outPath = join(iconsDir, outName);
  await writeFile(outPath, out);
  console.log(`Wrote ${outPath} — ${size}x${size} ${(out.length / 1024).toFixed(1)} KB`);
}

await makeIcon(192, 0.82, "icon-192.png");
await makeIcon(512, 0.82, "icon-512.png");
await makeIcon(512, 0.58, "icon-maskable-512.png");

// ── Optimized logo variants (webp) for the site ────────────────
// The 560KB source PNGs are never shipped: only these optimized
// variants are served from /img/system/.
const logoVariantsDir = join(publicDir, "img", "system");
await mkdir(logoVariantsDir, { recursive: true });

async function makeLogoVariant(source, width, outName) {
  const out = await sharp(source)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
  const outPath = join(logoVariantsDir, outName);
  await writeFile(outPath, out);
  console.log(`Wrote ${outPath} — w${width} ${(out.length / 1024).toFixed(1)} KB`);
}

for (const w of [480, 768, 1124]) {
  await makeLogoVariant(logoBuffer, w, `logo2-${w}.webp`);
}
await makeLogoVariant(iconLogoBuffer, 144, "logo1-144.webp");

// ── Club photos: originals from src/assets/photos → optimized WebP ──
// Cada slot admite .jpg/.jpeg/.png/.webp con el nombre descriptivo; si
// falta el original, se genera un placeholder de marca con el logo.
const photosDir = join(projectRoot, "src", "assets", "photos");
await mkdir(photosDir, { recursive: true });

const PHOTOS = [
  { id: "about-1", label: "NUESTRO LOCAL", aspect: [3, 2] },
  { id: "about-2", label: "AMBIENTE", aspect: [3, 2] },
  { id: "about-3", label: "BAR PREMIUM", aspect: [3, 2] },
  { id: "about-4", label: "SALAS VIP", aspect: [3, 2] },
  { id: "events-1", label: "DESPEDIDAS", aspect: [3, 2] },
  { id: "events-2", label: "FIESTAS PRIVADAS", aspect: [3, 2] },
  { id: "events-3", label: "QUINCHO PRIVADO", aspect: [3, 2] },
  { id: "events-4", label: "EVENTOS VIP", aspect: [3, 2] },
  { id: "instagram-1", label: "NOCHE DE CLUB", aspect: [1, 1] },
  { id: "instagram-2", label: "SHOWS EN VIVO", aspect: [1, 1] },
  { id: "instagram-3", label: "BARRA PREMIUM", aspect: [1, 1] },
  { id: "instagram-4", label: "FIESTAS", aspect: [1, 1] },
  { id: "instagram-5", label: "ZONA VIP", aspect: [1, 1] },
  { id: "instagram-6", label: "LINARES", aspect: [1, 1] },
];

const SLIDER_WIDTHS = [480, 800, 1200];
const IG_WIDTHS = [300, 600];

async function findOriginal(id) {
  for (const ext of [".jpg", ".jpeg", ".png", ".webp"]) {
    const candidate = join(photosDir, id + ext);
    try {
      await access(candidate);
      return candidate;
    } catch {
      // siguiente extensión
    }
  }
  return null;
}

function placeholderSvg(width, height, label, index) {
  const accents = [
    ["#ddb349", "#b07d3a"],
    ["#b07d3a", "#c3cad6"],
    ["#c3cad6", "#ddb349"],
  ];
  const [a, b] = accents[index % accents.length];
  const logoW = width * 0.52;
  const logoH = logoW * (721 / 1124);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#141210"/>
        <stop offset="100%" stop-color="#050505"/>
      </linearGradient>
      <linearGradient id="label" x1="0" y1="0" x2="100%" y2="0">
        <stop offset="0%" stop-color="${a}"/>
        <stop offset="100%" stop-color="${b}"/>
      </linearGradient>
      <radialGradient id="glowA" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${a}" stop-opacity="0.28"/>
        <stop offset="100%" stop-color="${a}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="glowB" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${b}" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="${b}" stop-opacity="0"/>
      </radialGradient>
      <pattern id="grid" x="0" y="0" width="${width / 20}" height="${width / 20}" patternUnits="userSpaceOnUse">
        <path d="M ${width / 20} 0 L 0 0 0 ${width / 20}" fill="none" stroke="#ddb349" stroke-opacity="0.08" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <ellipse cx="${width * 0.2}" cy="${height * 0.15}" rx="${width * 0.45}" ry="${height * 0.4}" fill="url(#glowA)"/>
    <ellipse cx="${width * 0.85}" cy="${height * 0.85}" rx="${width * 0.4}" ry="${height * 0.35}" fill="url(#glowB)"/>
    <g stroke="${a}" stroke-opacity="0.55" stroke-width="${Math.max(2, width / 533)}" fill="none">
      <line x1="${width * 0.045}" y1="${height * 0.075}" x2="${width * 0.13}" y2="${height * 0.075}"/>
      <line x1="${width * 0.045}" y1="${height * 0.075}" x2="${width * 0.045}" y2="${height * 0.21}"/>
      <line x1="${width * 0.955}" y1="${height * 0.925}" x2="${width * 0.87}" y2="${height * 0.925}"/>
      <line x1="${width * 0.955}" y1="${height * 0.925}" x2="${width * 0.955}" y2="${height * 0.79}"/>
    </g>
    <image
      x="${(width - logoW) / 2}" y="${(height - logoH) / 2 - height * 0.03}"
      width="${logoW}" height="${logoH}"
      href="data:image/png;base64,${logoBase64}"
      preserveAspectRatio="xMidYMid meet"
      opacity="0.96"
    />
    <text
      x="${width * 0.045}" y="${height * 0.93}"
      font-family="'Arial Black', 'Segoe UI', system-ui, sans-serif"
      font-size="${Math.round(width / 26)}" font-weight="900" letter-spacing="${Math.round(width / 160)}"
      fill="url(#label)"
    >${label}</text>
    <text
      x="${width * 0.955}" y="${height * 0.93}" text-anchor="end"
      font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
      font-size="${Math.round(width / 44)}" font-weight="600" letter-spacing="${Math.round(width / 210)}"
      fill="#9aa3b2"
    >LINARES · CHILE</text>
  </svg>`;
}

let placeholderCount = 0;
for (const [i, photo] of PHOTOS.entries()) {
  const widths = photo.aspect[0] === 1 ? IG_WIDTHS : SLIDER_WIDTHS;
  const maxWidth = Math.max(...widths);
  let sourcePath = await findOriginal(photo.id);
  if (!sourcePath) {
    const height = Math.round((maxWidth * photo.aspect[1]) / photo.aspect[0]);
    sourcePath = Buffer.from(placeholderSvg(maxWidth, height, photo.label, i), "utf8");
    placeholderCount++;
  }
  for (const w of widths) {
    const out = await sharp(sourcePath)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    const outPath = join(publicDir, "img", `${photo.id}-${w}.webp`);
    await writeFile(outPath, out);
  }
  const tag = sourcePath instanceof Buffer ? "placeholder" : "original";
  console.log(`Processed ${photo.id} (${tag}) → ${widths.length} variantes webp`);
}

if (placeholderCount > 0) {
  console.log(
    `${placeholderCount}/${PHOTOS.length} slots sin foto real — se generaron placeholders de marca. ` +
      `Suelta las fotos en src/assets/photos/ (ver README) y reconstruye.`
  );
}
