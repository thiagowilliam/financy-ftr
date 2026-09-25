import { Plus } from "lucide-react";
import { Page } from "@/components/Page";
import { pagination, transactions } from "@/components/transactions/mock-data";
import { TransactionsFilters } from "@/components/transactions/TransactionsFilters";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { Button } from "@/components/ui/button";

export function Transactions() {
  return (
    <Page className="flex flex-col gap-8 bg-transparent px-0 py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-bold text-2xl text-gray-800">Transações</h1>
          <p className="text-base text-gray-600">Gerencie todas as suas transações financeiras</p>
        </div>
        <Button size="sm" icon={Plus}>
          Nova transação
        </Button>
      </header>

      <TransactionsFilters />
      <TransactionsTable transactions={transactions} pagination={pagination} />
    </Page>
  );
}
