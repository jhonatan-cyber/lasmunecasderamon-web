import type { APIRoute } from "astro";
import { getInstagramFeed } from "../../lib/instagram";

export const prerender = false;

export const GET: APIRoute = async () => {
  const feed = await getInstagramFeed();

  return new Response(JSON.stringify(feed), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=600",
    },
  });
};
