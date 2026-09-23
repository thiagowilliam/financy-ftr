/**
 * Fonte única da verdade do design system Financy.
 * Consumido por tailwind.config.ts (classes + variáveis CSS do shadcn) e pela página de style guide.
 */

export const colors = {
  brand: {
    dark: "#124B2B",
    base: "#1F6F43",
  },
  gray: {
    800: "#111827",
    700: "#374151",
    600: "#4B5563",
    500: "#6B7280",
    400: "#9CA3AF",
    300: "#D1D5DB",
    200: "#E5E7EB",
    100: "#F8F9FA",
  },
  black: "#000000",
  white: "#FFFFFF",
  danger: "#EF4444",
  success: "#19AD70",
  blue: { dark: "#1D4ED8", base: "#2563EB", light: "#DBEAFE" },
  purple: { dark: "#7E22CE", base: "#9333EA", light: "#F3E8FF" },
  pink: { dark: "#BE185D", base: "#DB2777", light: "#FCE7F3" },
  red: { dark: "#B91C1C", base: "#DC2626", light: "#FEE2E2" },
  orange: { dark: "#C2410C", base: "#EA580C", light: "#FFEDD5" },
  yellow: { dark: "#A16207", base: "#CA8A04", light: "#F7F3CA" },
  green: { dark: "#15803D", base: "#16A34A", light: "#E0FAE9" },
} as const;

export type PaletteColor = "blue" | "purple" | "pink" | "red" | "orange" | "yellow" | "green";

export const paletteColors = [
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
] as const satisfies readonly PaletteColor[];

/** Mapeamento das variáveis semânticas do shadcn para os tokens. */
export const semanticColors = {
  background: colors.white,
  foreground: colors.gray[800],
  card: colors.white,
  "card-foreground": colors.gray[800],
  popover: colors.white,
  "popover-foreground": colors.gray[800],
  primary: colors.brand.base,
  "primary-foreground": colors.white,
  secondary: colors.white,
  "secondary-foreground": colors.gray[800],
  muted: colors.gray[100],
  "muted-foreground": colors.gray[500],
  accent: colors.gray[200],
  "accent-foreground": colors.gray[800],
  destructive: colors.danger,
  "destructive-foreground": colors.white,
  border: colors.gray[300],
  input: colors.gray[300],
  ring: colors.brand.base,
} as const;

export const fontFamily = {
  sans: "Inter",
} as const;

export const links = {
  googleFonts: "https://fonts.google.com/specimen/Inter",
  lucide: "https://lucide.dev/icons/",
} as const;

/** Converte "#RRGGBB" para canais HSL sem a função hsl() (ex.: "147 56.3% 27.8%"). */
export function hexToHslChannels(hex: string): string {
  const value = hex.replace("#", "");
  const r = Number.parseInt(value.slice(0, 2), 16) / 255;
  const g = Number.parseInt(value.slice(2, 4), 16) / 255;
  const b = Number.parseInt(value.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;

  if (max !== min) {
    const delta = max - min;
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === r) hue = (g - b) / delta + (g < b ? 6 : 0);
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
    hue *= 60;
  }

  const round = (n: number) => Math.round(n * 10) / 10;
  return `${round(hue)} ${round(saturation * 100)}% ${round(lightness * 100)}%`;
}
