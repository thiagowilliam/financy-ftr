import type { LucideIcon } from "lucide-react";
import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
} from "lucide-react";
import { colors, type PaletteColor } from "@/styles/tokens";

// Opções disponíveis no formulário de categoria.

export type CategoryIconOption = { value: string; label: string; icon: LucideIcon };

export const categoryIconOptions: CategoryIconOption[] = [
  { value: "briefcase", label: "Trabalho", icon: BriefcaseBusiness },
  { value: "car", label: "Carro", icon: CarFront },
  { value: "health", label: "Saúde", icon: HeartPulse },
  { value: "piggy-bank", label: "Investimento", icon: PiggyBank },
  { value: "shopping-cart", label: "Mercado", icon: ShoppingCart },
  { value: "ticket", label: "Entretenimento", icon: Ticket },
  { value: "tools", label: "Utilidades", icon: ToolCase },
  { value: "utensils", label: "Alimentação", icon: Utensils },
  { value: "pet", label: "Pets", icon: PawPrint },
  { value: "house", label: "Casa", icon: House },
  { value: "gift", label: "Presentes", icon: Gift },
  { value: "dumbbell", label: "Academia", icon: Dumbbell },
  { value: "book", label: "Educação", icon: BookOpen },
  { value: "baggage", label: "Viagem", icon: BaggageClaim },
  { value: "mailbox", label: "Correspondência", icon: Mailbox },
  { value: "receipt", label: "Contas", icon: ReceiptText },
];

export const categoryColorOptions: { value: PaletteColor; label: string }[] = [
  { value: "green", label: "Verde" },
  { value: "blue", label: "Azul" },
  { value: "purple", label: "Roxo" },
  { value: "pink", label: "Rosa" },
  { value: "red", label: "Vermelho" },
  { value: "orange", label: "Laranja" },
  { value: "yellow", label: "Amarelo" },
];

const DEFAULT_ICON = categoryIconOptions[0];
const DEFAULT_COLOR: PaletteColor = "green";

/** Ícone da categoria a partir da chave salva no backend (ex.: "utensils"). */
export function getCategoryIcon(key: string | null | undefined): CategoryIconOption {
  return categoryIconOptions.find((option) => option.value === key) ?? DEFAULT_ICON;
}

/** O backend guarda a cor em hexadecimal: usamos o tom "base" de cada cor da paleta. */
export function paletteColorToHex(color: PaletteColor): string {
  return colors[color].base;
}

export function hexToPaletteColor(hex: string | null | undefined): PaletteColor {
  const normalized = hex?.toUpperCase();
  const match = categoryColorOptions.find(({ value }) => colors[value].base === normalized);
  return match?.value ?? DEFAULT_COLOR;
}
