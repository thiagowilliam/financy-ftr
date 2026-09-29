import { CircleArrowDown, CircleArrowUp, Wallet } from "lucide-react";
import { CategoriesSummary } from "@/components/dashboard/CategoriesSummary";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { Page } from "@/components/Page";
import { useDashboardSummary } from "@/hooks/use-dashboard";
import { useTransactionsPage } from "@/hooks/use-transactions";
import { getErrorMessage } from "@/lib/graphql/client";

const RECENT_TRANSACTIONS = 5;
const NO_FILTERS = {};

/** Centavos -> reais; `undefined` mantém o card em estado de carregamento. */
const toReais = (cents: number | undefined) => (cents === undefined ? undefined : cents / 100);

export function Dashboard() {
  const summary = useDashboardSummary();
  // Reaproveita a query paginada da tela de Transações: mesmo cache e mesma invalidação.
  const recent = useTransactionsPage(NO_FILTERS, 1, RECENT_TRANSACTIONS);

  const summaryError = summary.isError
    ? `Não foi possível carregar o resumo. ${getErrorMessage(summary.error)}`
    : undefined;

  return (
    <Page className="flex flex-col gap-6 bg-transparent p-0 py-4">
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SummaryCard
          label="Saldo total"
          value={toReais(summary.data?.balance)}
          icon={Wallet}
          iconClassName="text-purple-base"
        />
        <SummaryCard
          label="Receitas do mês"
          value={toReais(summary.data?.periodIncome)}
          icon={CircleArrowUp}
          iconClassName="text-brand-base"
        />
        <SummaryCard
          label="Despesas do mês"
          value={toReais(summary.data?.periodExpense)}
          icon={CircleArrowDown}
          iconClassName="text-red-base"
        />
      </section>
      {summaryError && <p className="text-danger text-sm">{summaryError}</p>}

      <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTransactions
            transactions={recent.data?.items ?? []}
            isLoading={recent.isPending}
            error={
              recent.isError
                ? `Não foi possível carregar as transações. ${getErrorMessage(recent.error)}`
                : undefined
            }
          />
        </div>
        <CategoriesSummary
          categories={summary.data?.topExpenseCategories ?? []}
          isLoading={summary.isPending}
          error={summaryError}
        />
      </section>
    </Page>
  );
}
