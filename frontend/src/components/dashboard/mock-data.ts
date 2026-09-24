import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, CarFront, PiggyBank, ShoppingCart, Utensils } from "lucide-react";
import type { TransactionKind } from "@/components/ui/transaction-type";
import type { PaletteColor } from "@/styles/tokens";

// Dados estáticos da Dashboard enquanto a integração com a API não existe.

export type DashboardSummary = {
  balance: number;
  monthIncome: number;
  monthExpense: number;
};

export type RecentTransaction = {
  id: string;
  description: string;
  date: string;
  amount: number;
  type: TransactionKind;
  category: { name: string; color: PaletteColor; icon: LucideIcon };
};

export type CategorySummary = {
  id: string;
  name: string;
  color: PaletteColor;
  itemCount: number;
  total: number;
};

export const summary: DashboardSummary = {
  balance: 12847.32,
  monthIncome: 4250,
  monthExpense: 2180.45,
};

export const recentTransactions: RecentTransaction[] = [
  {
    id: "1",
    description: "Pagamento de Salário",
    date: "01/12/25",
    amount: 4250,
    type: "income",
    category: { name: "Receita", color: "green", icon: BriefcaseBusiness },
  },
  {
    id: "2",
    description: "Jantar no Restaurante",
    date: "30/11/25",
    amount: 89.5,
    type: "expense",
    category: { name: "Alimentação", color: "blue", icon: Utensils },
  },
  {
    id: "3",
    description: "Posto de Gasolina",
    date: "29/11/25",
    amount: 100,
    type: "expense",
    category: { name: "Transporte", color: "purple", icon: CarFront },
  },
  {
    id: "4",
    description: "Compras no Mercado",
    date: "28/11/25",
    amount: 156.8,
    type: "expense",
    category: { name: "Mercado", color: "orange", icon: ShoppingCart },
  },
  {
    id: "5",
    description: "Retorno de Investimento",
    date: "26/11/25",
    amount: 340.25,
    type: "income",
    category: { name: "Investimento", color: "green", icon: PiggyBank },
  },
];

export const categories: CategorySummary[] = [
  { id: "1", name: "Alimentação", color: "blue", itemCount: 12, total: 542.3 },
  { id: "2", name: "Transporte", color: "purple", itemCount: 8, total: 385.5 },
  { id: "3", name: "Mercado", color: "orange", itemCount: 3, total: 298.75 },
  { id: "4", name: "Entretenimento", color: "pink", itemCount: 2, total: 186.2 },
  { id: "5", name: "Utilidades", color: "yellow", itemCount: 7, total: 245.8 },
];
