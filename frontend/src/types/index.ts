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
