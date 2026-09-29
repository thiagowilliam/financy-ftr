import { CircleArrowDown, CircleArrowUp, Plus, Receipt } from "lucide-react";
import { getCategoryIcon, hexToPaletteColor } from "@/components/categories/category-options";
import { NewTransactionDialog } from "@/components/transactions/NewTransactionDialog";
import { Card } from "@/components/ui/card";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Link } from "@/components/ui/link";
import { Tag } from "@/components/ui/tag";
import { formatCurrency, formatShortDate } from "@/lib/format";
import type { Transaction } from "@/types";
import { DashboardCardHeader } from "./DashboardCardHeader";

type RecentTransactionsProps = {
  transactions: Transaction[];
  isLoading: boolean;
  /** Mensagem exibida quando a busca falha. */
  error?: string;
};

const SKELETON_ROWS = Array.from({ length: 5 }, (_, index) => `skeleton-${index}`);

export function RecentTransactions({ transactions, isLoading, error }: RecentTransactionsProps) {
  return (
    <Card className="overflow-hidden border-gray-200 shadow-none">
      <DashboardCardHeader title="Transações recentes" linkLabel="Ver todas" to="/transactions" />

      {isLoading ? (
        <ul
          aria-busy="true"
          aria-label="Carregando transações"
          className="divide-y divide-gray-200"
        >
          {SKELETON_ROWS.map((key) => (
            <li key={key} className="px-6 py-5">
              <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
            </li>
          ))}
        </ul>
      ) : error ? (
        <p className="px-6 py-10 text-center text-gray-600 text-sm">{error}</p>
      ) : transactions.length === 0 ? (
        <p className="px-6 py-10 text-center text-gray-600 text-sm">
          Nenhuma transação registrada ainda.
        </p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </ul>
      )}

      <div className="flex justify-center border-gray-200 border-t py-5">
        <NewTransactionDialog>
          <Link asChild className="inline-flex items-center gap-2">
            <button type="button">
              <Plus aria-hidden="true" className="size-5" />
              Nova transação
            </button>
          </Link>
        </NewTransactionDialog>
      </div>
    </Card>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const { description, date, amount, type, category } = transaction;
  const isIncome = type === "INCOME";
  const TypeIcon = isIncome ? CircleArrowUp : CircleArrowDown;
  const color = category ? hexToPaletteColor(category.color) : "gray";
  const icon = category ? getCategoryIcon(category.icon).icon : Receipt;

  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-4 px-6 py-5 sm:grid-cols-[1fr_10rem_9rem]">
      <div className="flex min-w-0 items-center gap-4">
        <CategoryIcon icon={icon} color={color} />
        <div className="min-w-0">
          <p className="truncate font-medium text-base text-gray-800">{description}</p>
          <p className="text-gray-600 text-sm">{formatShortDate(date)}</p>
        </div>
      </div>

      <div className="hidden justify-center sm:flex">
        <Tag color={color}>{category?.name ?? "Sem categoria"}</Tag>
      </div>

      <div className="flex items-center justify-end gap-2">
        <span className="whitespace-nowrap font-semibold text-gray-800 text-sm">
          {isIncome ? "+" : "-"} {formatCurrency(amount / 100)}
        </span>
        <TypeIcon
          aria-label={isIncome ? "Entrada" : "Saída"}
          className={isIncome ? "size-4 text-brand-base" : "size-4 text-danger"}
        />
      </div>
    </li>
  );
}
