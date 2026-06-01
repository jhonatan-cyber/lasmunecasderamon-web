/**
 * SEO helpers — Las Muñecas de Ramón
 * Nightclub exclusivo en Linares, Chile.
 */

export const SITE = {
  name: "Las Muñecas de Ramón",
  legalName: "Las Muñecas de Ramón",
  description:
    "Nightclub exclusivo en Linares, Chile. Shows en vivo, salas VIP, bar premium y el mejor ambiente nocturno de la Región del Maule.",
  shortDescription:
    "El nightclub más exclusivo de Linares. Experiencia VIP, shows en vivo y ambiente único.",
  url: "https://lasmuñecasderamon.com",
  domain: "lasmuñecasderamon.com",
  locale: "es_CL",
  twitter: "@lasmunecasderamon",
  ogImage: "/og-image.png",
  ogImageWebp: "/og-image.webp",
  ogImageAlt: "Las Muñecas de Ramón — Nightclub exclusivo en Linares, Chile",
  phone: "+56 9 87904824",
  phoneRaw: "56987904824",
  address: {
    street: "Valentín Letelier 182",
    locality: "Linares",
    region: "Maule",
    postalCode: "3581069",
    country: "CL",
  },
  geo: {
    lat: -35.8455,
    lng: -71.5975,
  },
  hours: {
    days: "Martes a Domingo",
    open: "22:00",
    close: "05:00",
    schema: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
  },
} as const;

export interface PageMeta {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  canonical?: string;
}

export function buildTitle(pageTitle: string): string {
  if (!pageTitle || pageTitle === SITE.name) return `${SITE.name} | Nightclub exclusivo en Linares`;
  return `${pageTitle} | ${SITE.name}`;
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return new URL(path, SITE.url).toString();
}

/**
 * Schema.org JSON-LD for the nightclub.
 * Used on the home and landing pages.
 */
export function nightClubJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "NightClub",
    name: SITE.name,
    image: absoluteUrl(SITE.ogImage),
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    openingHoursSpecification: SITE.hours.schema.map((day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: day,
      opens: SITE.hours.open,
      closes: SITE.hours.close,
    })),
    sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.social.tiktok],
  };
}
