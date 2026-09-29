import { ChevronLeft, ChevronRight, Receipt, SquarePen, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { getCategoryIcon, hexToPaletteColor } from "@/components/categories/category-options";
import { Card } from "@/components/ui/card";
import { CategoryIcon } from "@/components/ui/category-icon";
import { IconButton } from "@/components/ui/icon-button";
import { PaginationButton } from "@/components/ui/pagination-button";
import { Tag } from "@/components/ui/tag";
import { TransactionType } from "@/components/ui/transaction-type";
import { formatCurrency, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Transaction, TransactionPage } from "@/types";

type TransactionsTableProps = {
  page?: TransactionPage;
  isLoading: boolean;
  /** Buscando a próxima página enquanto a anterior continua na tela. */
  isFetching: boolean;
  /** Conteúdo exibido no lugar das linhas (erro ou lista vazia). */
  emptyState?: ReactNode;
  onPageChange: (page: number) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
};

const headerCellClassName = "px-6 py-5 font-medium text-gray-500 text-xs uppercase tracking-wide";
const SKELETON_ROWS = Array.from({ length: 5 }, (_, index) => `skeleton-${index}`);

export function TransactionsTable({
  page,
  isLoading,
  isFetching,
  emptyState,
  onPageChange,
  onEdit,
  onDelete,
}: TransactionsTableProps) {
  const items = page?.items ?? [];

  return (
    <Card className="overflow-hidden border-gray-200 shadow-none">
      <div className="overflow-x-auto">
        <table
          aria-busy={isLoading || isFetching}
          className={cn(
            "w-full min-w-[56rem] border-collapse transition-opacity",
            isFetching && !isLoading && "opacity-60",
          )}
        >
          <thead className="border-gray-200 border-b">
            <tr>
              <th className={`${headerCellClassName} text-left`}>Descrição</th>
              <th className={`${headerCellClassName} text-center`}>Data</th>
              <th className={`${headerCellClassName} text-center`}>Categoria</th>
              <th className={`${headerCellClassName} text-center`}>Tipo</th>
              <th className={`${headerCellClassName} text-right`}>Valor</th>
              <th className={`${headerCellClassName} text-right`}>Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading
              ? SKELETON_ROWS.map((key) => (
                  <tr key={key}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
                    </td>
                  </tr>
                ))
              : items.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
            {!isLoading && items.length === 0 && emptyState && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  {emptyState}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {page && page.total > 0 && (
        <TransactionsPagination page={page} disabled={isFetching} onPageChange={onPageChange} />
      )}
    </Card>
  );
}

type TransactionRowProps = {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
};

function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
  const { description, date, amount, type, category } = transaction;
  const isIncome = type === "INCOME";
  const color = category ? hexToPaletteColor(category.color) : "gray";
  const icon = category ? getCategoryIcon(category.icon).icon : Receipt;

  return (
    <tr>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <CategoryIcon icon={icon} color={color} />
          <span className="font-medium text-base text-gray-800">{description}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-center text-gray-600 text-sm">{formatShortDate(date)}</td>
      <td className="px-6 py-4 text-center">
        <Tag color={color}>{category?.name ?? "Sem categoria"}</Tag>
      </td>
      <td className="px-6 py-4 text-center">
        <TransactionType type={isIncome ? "income" : "expense"} />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-gray-800 text-sm">
        {isIncome ? "+" : "-"} {formatCurrency(amount / 100)}
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <IconButton
            icon={Trash2}
            variant="danger"
            aria-label={`Excluir ${description}`}
            onClick={() => onDelete(transaction)}
          />
          <IconButton
            icon={SquarePen}
            aria-label={`Editar ${description}`}
            onClick={() => onEdit(transaction)}
          />
        </div>
      </td>
    </tr>
  );
}

/** Números de página com reticências, ex.: 1 … 4 5 6 … 12. */
function getPageItems(
  current: number,
  total: number,
): (number | "ellipsis-start" | "ellipsis-end")[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const start = Math.max(2, Math.min(current - 1, total - 4));
  const end = Math.min(total - 1, Math.max(current + 1, 5));
  return [
    1,
    ...(start > 2 ? (["ellipsis-start"] as const) : []),
    ...Array.from({ length: end - start + 1 }, (_, index) => start + index),
    ...(end < total - 1 ? (["ellipsis-end"] as const) : []),
    total,
  ];
}

type TransactionsPaginationProps = {
  page: TransactionPage;
  disabled: boolean;
  onPageChange: (page: number) => void;
};

function TransactionsPagination({ page, disabled, onPageChange }: TransactionsPaginationProps) {
  const { page: currentPage, perPage, total, totalPages, items } = page;
  const from = (currentPage - 1) * perPage + 1;
  const to = from + items.length - 1;

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-gray-200 border-t px-6 py-5 sm:flex-row">
      <p className="text-gray-700 text-sm">
        <span className="font-medium">
          {from} a {to}
        </span>{" "}
        <span className="text-gray-300">|</span> {total} {total === 1 ? "resultado" : "resultados"}
      </p>

      <nav aria-label="Paginação" className="flex items-center gap-2">
        <PaginationButton
          aria-label="Página anterior"
          disabled={disabled || currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft aria-hidden="true" />
        </PaginationButton>
        {getPageItems(currentPage, totalPages).map((item) =>
          typeof item === "number" ? (
            <PaginationButton
              key={item}
              isActive={item === currentPage}
              disabled={disabled}
              onClick={() => onPageChange(item)}
            >
              {item}
            </PaginationButton>
          ) : (
            <span key={item} aria-hidden="true" className="px-1 text-gray-500 text-sm">
              …
            </span>
          ),
        )}
        <PaginationButton
          aria-label="Próxima página"
          disabled={disabled || currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight aria-hidden="true" />
        </PaginationButton>
      </nav>
    </div>
  );
}
