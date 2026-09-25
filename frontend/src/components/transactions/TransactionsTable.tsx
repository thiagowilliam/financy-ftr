import { ChevronLeft, ChevronRight, SquarePen, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CategoryIcon } from "@/components/ui/category-icon";
import { IconButton } from "@/components/ui/icon-button";
import { PaginationButton } from "@/components/ui/pagination-button";
import { Tag } from "@/components/ui/tag";
import { TransactionType } from "@/components/ui/transaction-type";
import { formatCurrency } from "@/lib/format";
import type { pagination as paginationData, Transaction } from "./mock-data";

type TransactionsTableProps = {
  transactions: Transaction[];
  pagination: typeof paginationData;
};

const headerCellClassName = "px-6 py-5 font-medium text-gray-500 text-xs uppercase tracking-wide";

export function TransactionsTable({ transactions, pagination }: TransactionsTableProps) {
  return (
    <Card className="overflow-hidden border-gray-200 shadow-none">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[56rem] border-collapse">
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
            {transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>

      <TransactionsPagination pagination={pagination} />
    </Card>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const { description, date, amount, type, category } = transaction;
  const isIncome = type === "income";

  return (
    <tr>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <CategoryIcon icon={category.icon} color={category.color} />
          <span className="font-medium text-base text-gray-800">{description}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-center text-gray-600 text-sm">{date}</td>
      <td className="px-6 py-4 text-center">
        <Tag color={category.color}>{category.name}</Tag>
      </td>
      <td className="px-6 py-4 text-center">
        <TransactionType type={type} />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-gray-800 text-sm">
        {isIncome ? "+" : "-"} {formatCurrency(amount)}
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <IconButton icon={Trash2} variant="danger" aria-label={`Excluir ${description}`} />
          <IconButton icon={SquarePen} aria-label={`Editar ${description}`} />
        </div>
      </td>
    </tr>
  );
}

function TransactionsPagination({ pagination }: { pagination: typeof paginationData }) {
  const { from, to, total, currentPage, totalPages } = pagination;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-gray-200 border-t px-6 py-5 sm:flex-row">
      <p className="text-gray-700 text-sm">
        <span className="font-medium">
          {from} a {to}
        </span>{" "}
        <span className="text-gray-300">|</span> {total} resultados
      </p>

      <nav aria-label="Paginação" className="flex items-center gap-2">
        <PaginationButton aria-label="Página anterior" disabled={currentPage === 1}>
          <ChevronLeft aria-hidden="true" />
        </PaginationButton>
        {pages.map((page) => (
          <PaginationButton key={page} isActive={page === currentPage}>
            {page}
          </PaginationButton>
        ))}
        <PaginationButton aria-label="Próxima página" disabled={currentPage === totalPages}>
          <ChevronRight aria-hidden="true" />
        </PaginationButton>
      </nav>
    </div>
  );
}
