import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme.js";
import plugin from "tailwindcss/plugin.js";
import tailwindcssAnimate from "tailwindcss-animate";
import { colors, fontFamily, hexToHslChannels, semanticColors } from "./src/styles/tokens.ts";

const semanticVars = Object.fromEntries(
  Object.entries(semanticColors).map(([name, hex]) => [`--${name}`, hexToHslChannels(hex)]),
);

const shadcnColor = (name: string) => ({
  DEFAULT: `hsl(var(--${name}))`,
  foreground: `hsl(var(--${name}-foreground))`,
});

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    // theme.colors (e não extend) substitui a paleta padrão do Tailwind por completo.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      ...colors,
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: shadcnColor("primary"),
      secondary: shadcnColor("secondary"),
      destructive: shadcnColor("destructive"),
      muted: shadcnColor("muted"),
      accent: shadcnColor("accent"),
      popover: shadcnColor("popover"),
      card: shadcnColor("card"),
    },
    extend: {
      fontFamily: {
        sans: [fontFamily.sans, ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    // Variáveis semânticas do shadcn geradas a partir de tokens.ts (canais HSL sem hsl()).
    plugin(({ addBase }) => {
      addBase({ ":root": semanticVars });
    }),
  ],
} satisfies Config;
