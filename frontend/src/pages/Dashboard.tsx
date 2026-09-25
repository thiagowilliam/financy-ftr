import { CircleArrowDown, CircleArrowUp, Wallet } from "lucide-react";
import { CategoriesSummary } from "@/components/dashboard/CategoriesSummary";
import { categories, recentTransactions, summary } from "@/components/dashboard/mock-data";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { Page } from "@/components/Page";

export function Dashboard() {
  return (
    <Page>
    <div className="flex flex-col gap-6 py-8">
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SummaryCard
          label="Saldo total"
          value={summary.balance}
          icon={Wallet}
          iconClassName="text-purple-base"
        />
        <SummaryCard
          label="Receitas do mês"
          value={summary.monthIncome}
          icon={CircleArrowUp}
          iconClassName="text-brand-base"
        />
        <SummaryCard
          label="Despesas do mês"
          value={summary.monthExpense}
          icon={CircleArrowDown}
          iconClassName="text-red-base"
        />
      </section>

      <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTransactions transactions={recentTransactions} />
        </div>
        <CategoriesSummary categories={categories} />
      </section>
    </div>
    </Page>
  );
}
