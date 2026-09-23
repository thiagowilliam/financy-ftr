import { registerEnumType } from "type-graphql";
import { ValidationError } from "../errors/validation.error.js";

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

registerEnumType(TransactionType, {
  name: "TransactionType",
  description: "Tipo da movimentacao financeira: entrada (INCOME) ou saida (EXPENSE).",
});

export const TRANSACTION_TYPES: readonly string[] = [
  TransactionType.INCOME,
  TransactionType.EXPENSE,
];

/**
 * Converte o valor String vindo do banco (SQLite nao tem enum) para o enum
 * do dominio, sem cast forcado.
 */
export function toTransactionType(value: string, field = "type"): TransactionType {
  if (value === TransactionType.INCOME) {
    return TransactionType.INCOME;
  }
  if (value === TransactionType.EXPENSE) {
    return TransactionType.EXPENSE;
  }
  throw new ValidationError(
    `O campo "${field}" deve ser um destes valores: ${TRANSACTION_TYPES.join(", ")}.`,
    field,
  );
}
