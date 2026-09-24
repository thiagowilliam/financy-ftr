import { CircleArrowDown, CircleArrowUp, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Link } from "@/components/ui/link";
import { Tag } from "@/components/ui/tag";
import { formatCurrency } from "@/lib/format";
import { DashboardCardHeader } from "./DashboardCardHeader";
import type { RecentTransaction } from "./mock-data";

type RecentTransactionsProps = {
  transactions: RecentTransaction[];
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className="overflow-hidden border-gray-200 shadow-none">
      <DashboardCardHeader title="Transações recentes" linkLabel="Ver todas" to="/transactions" />

      <ul className="divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </ul>

      <div className="flex justify-center border-gray-200 border-t py-5">
        <Link asChild className="inline-flex items-center gap-2">
          <button type="button">
            <Plus aria-hidden="true" className="size-5" />
            Nova transação
          </button>
        </Link>
      </div>
    </Card>
  );
}

function TransactionRow({ transaction }: { transaction: RecentTransaction }) {
  const { description, date, amount, type, category } = transaction;
  const isIncome = type === "income";
  const TypeIcon = isIncome ? CircleArrowUp : CircleArrowDown;

  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-4 px-6 py-5 sm:grid-cols-[1fr_10rem_9rem]">
      <div className="flex min-w-0 items-center gap-4">
        <CategoryIcon icon={category.icon} color={category.color} />
        <div className="min-w-0">
          <p className="truncate font-medium text-base text-gray-800">{description}</p>
          <p className="text-gray-600 text-sm">{date}</p>
        </div>
      </div>

      <div className="hidden justify-center sm:flex">
        <Tag color={category.color}>{category.name}</Tag>
      </div>

      <div className="flex items-center justify-end gap-2">
        <span className="whitespace-nowrap font-semibold text-gray-800 text-sm">
          {isIncome ? "+" : "-"} {formatCurrency(amount)}
        </span>
        <TypeIcon
          aria-label={isIncome ? "Entrada" : "Saída"}
          className={isIncome ? "size-4 text-brand-base" : "size-4 text-danger"}
        />
      </div>
    </li>
  );
}
