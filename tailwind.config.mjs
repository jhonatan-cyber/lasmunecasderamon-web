/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Marca: dorado, negro y plateado ──────────────────────────
        // Los logos del club son monocromos (blanco/plata/negro); el dorado
        // es el acento de lujo del sistema.
        gold: {
          50: "#fdfaf1",
          100: "#f9f0d4",
          200: "#f2e0a4",
          300: "#e8ca6a",
          400: "#ddb349",
          500: "#c9972d", // dorado principal
          600: "#a8781f",
          700: "#875e18",
          800: "#6b4a16",
          900: "#563c14",
          950: "#33230a",
        },
        silver: {
          50: "#f8fafc",
          100: "#eef1f5",
          200: "#dde2ea",
          300: "#c3cad6",
          400: "#9aa3b2",
          500: "#6f7787",
          600: "#4d5462",
          700: "#363c47",
          800: "#232830",
          900: "#14171c",
          950: "#090b0e",
        },
        // Bronce: tono cálido profundo para acentos secundarios
        bronze: {
          300: "#e2c9a0",
          400: "#cda469",
          500: "#b07d3a",
          600: "#8f6127",
          700: "#744e20",
        },
        // Negro base de la interfaz
        ink: {
          950: "#050505",
          900: "#0b0a09",
          800: "#141210",
          700: "#1c1917",
          600: "#2a251f",
        },
      },
      fontFamily: {
        sans: [
          '"Space Grotesk"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: ['"Anton"', 'Impact', '"Arial Black"', "sans-serif"],
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        marqueeSlow: "marquee 44s linear infinite",
        drift: "drift 16s ease-in-out infinite",
        driftSlow: "drift 24s ease-in-out infinite reverse",
        shimmer: "shimmer 5s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "zoom-in": "zoomIn 0.5s ease-out",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(6%, -8%) scale(1.12)" },
          "66%": { transform: "translate(-5%, 6%) scale(0.94)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "1" },
          "45%": { opacity: "0.88" },
          "70%": { opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        zoomIn: {
          "0%": { transform: "scale(0.9)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};