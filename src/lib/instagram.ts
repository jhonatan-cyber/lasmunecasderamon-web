/**
 * Cliente server-side del feed de Instagram.
 *
 * Usa la "Instagram API with Instagram Login" (graph.instagram.com), la API
 * vigente tras el sunset de Instagram Basic Display (dic 2024).
 *
 * - Cache en memoria (1 h) para proteger rate limits.
 * - Refresh oportunista del token long-lived cada ~45 días (los tokens
 *   duran 60; mientras el sitio reciba tráfico, el token no expira).
 * - Variables de entorno: en Cloudflare se lee `INSTAGRAM_ACCESS_TOKEN`
 *   desde `cloudflare:workers`; en local, desde `.env` (import.meta.env).
 * - Todas las fallas devuelven respuesta vacía pero OK: el frontend
 *   mantiene los placeholders sin romper la página.
 */

export interface InstagramPost {
  id: string;
  caption: string | null;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  permalink: string;
  timestamp: string;
}

export interface InstagramResult {
  ok: boolean;
  configured: boolean;
  source: "instagram" | "cache" | "empty";
  posts: InstagramPost[];
  error?: string;
}

const MEDIA_TTL_MS = 60 * 60 * 1000; // 1 hora
const TOKEN_REFRESH_MS = 45 * 24 * 60 * 60 * 1000; // 45 días
const GRAPH_FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
const POST_LIMIT = 12;

let memoryCache: { posts: InstagramPost[]; fetchedAt: number; tokenUpdatedAt: number } = {
  posts: [],
  fetchedAt: 0,
  tokenUpdatedAt: 0,
};

/**
 * Token desde el env del worker (prod: variables del dashboard de Cloudflare;
 * dev: platformProxy expone .env). En Astro 6 locals.runtime fue eliminado.
 */
async function getWorkerEnv(key: string): Promise<string | null> {
  try {
    const cf = (await import("cloudflare:workers")) as {
      env: Record<string, unknown>;
    };
    const value = cf.env?.[key];
    return typeof value === "string" && value.trim() ? value.trim() : null;
  } catch {
    return null;
  }
}

export async function getInstagramToken(): Promise<string | null> {
  return getWorkerEnv("INSTAGRAM_ACCESS_TOKEN");
}

async function graphFetch(url: string): Promise<{ data?: unknown; error?: { message?: string } }> {
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Graph API ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

function normalizePost(raw: Record<string, unknown>): InstagramPost {
  const mediaType = String(raw.media_type ?? "IMAGE");
  return {
    id: String(raw.id ?? ""),
    caption: typeof raw.caption === "string" ? raw.caption : null,
    mediaType,
    mediaUrl: String(raw.media_url ?? ""),
    thumbnailUrl: typeof raw.thumbnail_url === "string" ? raw.thumbnail_url : null,
    permalink: String(raw.permalink ?? ""),
    timestamp: String(raw.timestamp ?? ""),
  };
}

async function fetchMedia(token: string): Promise<InstagramPost[]> {
  const url =
    `https://graph.instagram.com/me/media?fields=${GRAPH_FIELDS}` +
    `&limit=${POST_LIMIT}&access_token=${encodeURIComponent(token)}`;
  const json = await graphFetch(url);
  const rows = Array.isArray(json.data) ? (json.data as Record<string, unknown>[]) : [];
  return rows.map(normalizePost).filter((p) => p.permalink && (p.mediaUrl || p.thumbnailUrl));
}

/** Refresh oportunista: mantiene vivo el token long-lived (60 d) con tráfico normal. */
async function refreshTokenIfNeeded(token: string): Promise<string> {
  const now = Date.now();
  if (now - memoryCache.tokenUpdatedAt < TOKEN_REFRESH_MS) return token;
  try {
    const url =
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token` +
      `&access_token=${encodeURIComponent(token)}`;
    const json = await graphFetch(url);
    const next = (json as { access_token?: unknown }).access_token;
    if (typeof next === "string" && next) {
      memoryCache.tokenUpdatedAt = now;
      return next;
    }
  } catch {
    // Token aún válido para fetch; se reintenta en la próxima petición.
  }
  return token;
}

export async function getInstagramFeed(): Promise<InstagramResult> {
  const token = await getInstagramToken();
  if (!token) {
    return { ok: true, configured: false, source: "empty", posts: [] };
  }

  const now = Date.now();
  if (memoryCache.fetchedAt && now - memoryCache.fetchedAt < MEDIA_TTL_MS && memoryCache.posts.length) {
    return { ok: true, configured: true, source: "cache", posts: memoryCache.posts };
  }

  try {
    const activeToken = await refreshTokenIfNeeded(token);
    const posts = await fetchMedia(activeToken);
    if (posts.length === 0) {
      return { ok: true, configured: true, source: "empty", posts: [] };
    }
    memoryCache.posts = posts;
    memoryCache.fetchedAt = now;
    memoryCache.tokenUpdatedAt = memoryCache.tokenUpdatedAt || now;
    return { ok: true, configured: true, source: "instagram", posts };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    if (memoryCache.posts.length) {
      return { ok: true, configured: true, source: "cache", posts: memoryCache.posts };
    }
    return { ok: true, configured: true, source: "empty", posts: [], error: message };
  }
}
