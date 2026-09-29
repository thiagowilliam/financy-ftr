export interface User {
  id: string
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
}


export interface RegisterInput {
  name: string
  email: string
  password: string
}


export interface LoginInput {
  email: string
  password: string
}

export type TransactionTypeValue = "INCOME" | "EXPENSE"

export interface Category {
  id: string
  name: string
  description: string | null
  type: TransactionTypeValue
  icon: string | null
  /** Cor hexadecimal, ex.: #2563EB */
  color: string | null
  transactionCount: number
}

export interface CategoryInput {
  name: string
  description: string | null
  type: TransactionTypeValue
  icon: string
  color: string
}

export interface Transaction {
  id: string
  description: string
  /** Valor em centavos */
  amount: number
  type: TransactionTypeValue
  /** Data ISO, ex.: 2026-09-29T12:00:00.000Z */
  date: string
  category: Pick<Category, "id" | "name" | "icon" | "color"> | null
}

export interface TransactionInput {
  description: string
  amount: number
  type: TransactionTypeValue
  date: string
  categoryId: string | null
}

export interface TransactionFilters {
  search?: string
  type?: TransactionTypeValue
  categoryId?: string
  startDate?: string
  endDate?: string
}

export interface TransactionPage {
  items: Transaction[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

/** Movimentação de uma categoria no período. Valores em centavos */
export interface CategorySummary {
  category: Pick<Category, "id" | "name" | "icon" | "color">
  transactionCount: number
  income: number
  expense: number
  /** Receitas menos despesas: negativo quando gastou mais */
  total: number
}

/** Valores em centavos */
export interface DashboardSummary {
  balance: number
  periodIncome: number
  periodExpense: number
  topCategories: CategorySummary[]
}
