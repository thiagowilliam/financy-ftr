import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  CarFront,
  HeartPulse,
  PiggyBank,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
} from "lucide-react";
import type { PaletteColor } from "@/styles/tokens";

// Dados estáticos da página de Categorias enquanto a integração com a API não existe.

export type Category = {
  id: string;
  name: string;
  description: string;
  color: PaletteColor;
  icon: LucideIcon;
  itemCount: number;
};

export type CategoriesOverview = {
  totalCategories: number;
  totalTransactions: number;
  mostUsed: { name: string; icon: LucideIcon; color: PaletteColor };
};

export const categories: Category[] = [
  {
    id: "1",
    name: "Alimentação",
    description: "Restaurantes, delivery e refeições",
    color: "blue",
    icon: Utensils,
    itemCount: 12,
  },
  {
    id: "2",
    name: "Entretenimento",
    description: "Cinema, jogos e lazer",
    color: "pink",
    icon: Ticket,
    itemCount: 2,
  },
  {
    id: "3",
    name: "Investimento",
    description: "Aplicações e retornos financeiros",
    color: "green",
    icon: PiggyBank,
    itemCount: 1,
  },
  {
    id: "4",
    name: "Mercado",
    description: "Compras de supermercado e mantimentos",
    color: "orange",
    icon: ShoppingCart,
    itemCount: 3,
  },
  {
    id: "5",
    name: "Salário",
    description: "Renda mensal e bonificações",
    color: "green",
    icon: BriefcaseBusiness,
    itemCount: 3,
  },
  {
    id: "6",
    name: "Saúde",
    description: "Medicamentos, consultas e exames",
    color: "red",
    icon: HeartPulse,
    itemCount: 0,
  },
  {
    id: "7",
    name: "Transporte",
    description: "Gasolina, transporte público e viagens",
    color: "purple",
    icon: CarFront,
    itemCount: 8,
  },
  {
    id: "8",
    name: "Utilidades",
    description: "Energia, água, internet e telefone",
    color: "yellow",
    icon: ToolCase,
    itemCount: 7,
  },
];

export const overview: CategoriesOverview = {
  totalCategories: 8,
  totalTransactions: 27,
  mostUsed: { name: "Alimentação", icon: Utensils, color: "blue" },
};
