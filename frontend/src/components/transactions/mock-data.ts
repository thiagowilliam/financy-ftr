import {
  BriefcaseBusiness,
  CarFront,
  House,
  PiggyBank,
  ShoppingCart,
  Ticket,
  Utensils,
} from "lucide-react";
import type { RecentTransaction } from "@/components/dashboard/mock-data";
import type { SelectOption } from "@/components/ui/select";

// Dados estáticos da página de Transações enquanto a integração com a API não existe.

export type Transaction = RecentTransaction;

export const transactions: Transaction[] = [
  {
    id: "1",
    description: "Jantar no Restaurante",
    date: "30/11/25",
    amount: 89.5,
    type: "expense",
    category: { name: "Alimentação", color: "blue", icon: Utensils },
  },
  {
    id: "2",
    description: "Posto de Gasolina",
    date: "29/11/25",
    amount: 100,
    type: "expense",
    category: { name: "Transporte", color: "purple", icon: CarFront },
  },
  {
    id: "3",
    description: "Compras no Mercado",
    date: "28/11/25",
    amount: 156.8,
    type: "expense",
    category: { name: "Mercado", color: "orange", icon: ShoppingCart },
  },
  {
    id: "4",
    description: "Retorno de Investimento",
    date: "26/11/25",
    amount: 340.25,
    type: "income",
    category: { name: "Investimento", color: "green", icon: PiggyBank },
  },
  {
    id: "5",
    description: "Aluguel",
    date: "26/11/25",
    amount: 1700,
    type: "expense",
    category: { name: "Utilidades", color: "yellow", icon: House },
  },
  {
    id: "6",
    description: "Freelance",
    date: "24/11/25",
    amount: 2500,
    type: "income",
    category: { name: "Salário", color: "green", icon: BriefcaseBusiness },
  },
  {
    id: "7",
    description: "Compras Jantar",
    date: "22/11/25",
    amount: 150,
    type: "expense",
    category: { name: "Mercado", color: "orange", icon: ShoppingCart },
  },
  {
    id: "8",
    description: "Cinema",
    date: "18/12/25",
    amount: 88,
    type: "expense",
    category: { name: "Entretenimento", color: "pink", icon: Ticket },
  },
];

export const pagination = {
  from: 1,
  to: 10,
  total: 27,
  currentPage: 1,
  totalPages: 3,
};

export const typeOptions: SelectOption[] = [
  { value: "all", label: "Todos" },
  { value: "income", label: "Entrada" },
  { value: "expense", label: "Saída" },
];

export const categoryOptions: SelectOption[] = [
  { value: "all", label: "Todas" },
  { value: "alimentacao", label: "Alimentação" },
  { value: "transporte", label: "Transporte" },
  { value: "mercado", label: "Mercado" },
  { value: "investimento", label: "Investimento" },
  { value: "utilidades", label: "Utilidades" },
  { value: "salario", label: "Salário" },
  { value: "entretenimento", label: "Entretenimento" },
];

export const periodOptions: SelectOption[] = [
  { value: "2025-12", label: "Dezembro / 2025" },
  { value: "2025-11", label: "Novembro / 2025" },
  { value: "2025-10", label: "Outubro / 2025" },
];
