import { TransactionType } from "../../shared/enums/transaction-type.enum.js";

// Cores = tons "base" da paleta do frontend (frontend/src/styles/tokens.ts).
// Icones = chaves de frontend/src/components/categories/category-options.ts.
export const CATEGORY_COLORS = {
  blue: "#2563EB",
  purple: "#9333EA",
  pink: "#DB2777",
  red: "#DC2626",
  orange: "#EA580C",
  yellow: "#CA8A04",
  green: "#16A34A",
} as const;

export interface DefaultCategory {
  name: string;
  description: string;
  type: TransactionType;
  icon: string;
  color: string;
}

/** Categorias criadas automaticamente para todo novo usuario. */
export const DEFAULT_CATEGORIES: readonly DefaultCategory[] = [
  {
    name: "Alimentação",
    description: "Restaurantes, delivery e refeições",
    type: TransactionType.EXPENSE,
    icon: "utensils",
    color: CATEGORY_COLORS.blue,
  },
  {
    name: "Entretenimento",
    description: "Cinema, jogos e lazer",
    type: TransactionType.EXPENSE,
    icon: "ticket",
    color: CATEGORY_COLORS.pink,
  },
  {
    name: "Investimento",
    description: "Aplicações e retornos financeiros",
    type: TransactionType.INCOME,
    icon: "piggy-bank",
    color: CATEGORY_COLORS.green,
  },
  {
    name: "Mercado",
    description: "Compras de supermercado e mantimentos",
    type: TransactionType.EXPENSE,
    icon: "shopping-cart",
    color: CATEGORY_COLORS.orange,
  },
  {
    name: "Salário",
    description: "Renda mensal e bonificações",
    type: TransactionType.INCOME,
    icon: "briefcase",
    color: CATEGORY_COLORS.green,
  },
  {
    name: "Saúde",
    description: "Medicamentos, consultas e exames",
    type: TransactionType.EXPENSE,
    icon: "health",
    color: CATEGORY_COLORS.red,
  },
  {
    name: "Transporte",
    description: "Gasolina, transporte público e viagens",
    type: TransactionType.EXPENSE,
    icon: "car",
    color: CATEGORY_COLORS.purple,
  },
  {
    name: "Utilidades",
    description: "Energia, água, internet e telefone",
    type: TransactionType.EXPENSE,
    icon: "tools",
    color: CATEGORY_COLORS.yellow,
  },
];
