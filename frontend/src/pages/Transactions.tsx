import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Page } from "@/components/Page";
import { DeleteTransactionDialog } from "@/components/transactions/DeleteTransactionDialog";
import { TransactionFormDialog } from "@/components/transactions/TransactionFormDialog";
import {
  ALL,
  TransactionsFilters,
  type TransactionsFiltersValue,
} from "@/components/transactions/TransactionsFilters";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { Button } from "@/components/ui/button";
import { useTransactionsPage } from "@/hooks/use-transactions";
import { getErrorMessage } from "@/lib/graphql/client";
import { periodToRange } from "@/lib/period";
import type { Transaction, TransactionFilters } from "@/types";

type FormState = { open: false } | { open: true; transaction: Transaction | null };

/** Nome dos parâmetros de URL: os filtros sobrevivem a recarregar a página e ao "voltar". */
const PARAMS = { search: "q", type: "tipo", categoryId: "categoria", period: "periodo" } as const;

function toApiFilters({ search, type, categoryId, period }: TransactionsFiltersValue) {
  const filters: TransactionFilters = {};
  if (search) filters.search = search;
  if (type === "INCOME" || type === "EXPENSE") filters.type = type;
  if (categoryId !== ALL) filters.categoryId = categoryId;
  const range = period === ALL ? null : periodToRange(period);
  if (range) Object.assign(filters, range);
  return filters;
}

export function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState<FormState>({ open: false });
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const filters: TransactionsFiltersValue = {
    search: searchParams.get(PARAMS.search) ?? "",
    type: searchParams.get(PARAMS.type) ?? ALL,
    categoryId: searchParams.get(PARAMS.categoryId) ?? ALL,
    period: searchParams.get(PARAMS.period) ?? ALL,
  };
  const page = Math.max(1, Number(searchParams.get("pagina")) || 1);

  // O React Query compara a query key por valor, então não precisa de useMemo aqui.
  const apiFilters = toApiFilters(filters);
  const { data, isPending, isFetching, isError, error, refetch } = useTransactionsPage(
    apiFilters,
    page,
  );

  const updateParams = useCallback(
    (changes: Partial<TransactionsFiltersValue> & { page?: number }) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          for (const [key, param] of Object.entries(PARAMS)) {
            const value = changes[key as keyof TransactionsFiltersValue];
            if (value === undefined) continue;
            if (value === "" || value === ALL) next.delete(param);
            else next.set(param, value);
          }
          // Qualquer mudança de filtro volta para a primeira página.
          if (changes.page && changes.page > 1) next.set("pagina", String(changes.page));
          else next.delete("pagina");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Ex.: excluir o último item da última página -> volta para a última página existente.
  useEffect(() => {
    if (data && page > data.totalPages) updateParams({ page: data.totalPages });
  }, [data, page, updateParams]);

  const hasFilters = Object.keys(apiFilters).length > 0;
  const clearFilters = () => updateParams({ search: "", type: ALL, categoryId: ALL, period: ALL });

  const emptyState = isError ? (
    <div className="flex flex-col items-center gap-3">
      <p className="text-gray-600 text-sm">
        Não foi possível carregar as transações. {getErrorMessage(error)}
      </p>
      <Button size="sm" variant="secondary" onClick={() => refetch()}>
        Tentar novamente
      </Button>
    </div>
  ) : hasFilters ? (
    <div className="flex flex-col items-center gap-3">
      <p className="text-gray-600 text-sm">Nenhuma transação encontrada para esses filtros.</p>
      <Button size="sm" variant="secondary" onClick={clearFilters}>
        Limpar filtros
      </Button>
    </div>
  ) : (
    <div className="flex flex-col items-center gap-3">
      <p className="text-gray-600 text-sm">Você ainda não possui transações.</p>
      <Button size="sm" icon={Plus} onClick={() => setForm({ open: true, transaction: null })}>
        Criar primeira transação
      </Button>
    </div>
  );

  return (
    <Page className="flex flex-col gap-8 bg-transparent px-0 py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-bold text-2xl text-gray-800">Transações</h1>
          <p className="text-base text-gray-600">Gerencie todas as suas transações financeiras</p>
        </div>
        <Button size="sm" icon={Plus} onClick={() => setForm({ open: true, transaction: null })}>
          Nova transação
        </Button>
      </header>

      <TransactionsFilters value={filters} onChange={updateParams} />
      <TransactionsTable
        page={data}
        isLoading={isPending}
        isFetching={isFetching}
        emptyState={emptyState}
        onPageChange={(nextPage) => updateParams({ page: nextPage })}
        onEdit={(transaction) => setForm({ open: true, transaction })}
        onDelete={setTransactionToDelete}
      />

      <TransactionFormDialog
        open={form.open}
        transaction={form.open ? form.transaction : null}
        onOpenChange={(open) => {
          if (!open) setForm({ open: false });
        }}
      />
      <DeleteTransactionDialog
        transaction={transactionToDelete}
        onOpenChange={(open) => {
          if (!open) setTransactionToDelete(null);
        }}
      />
    </Page>
  );
}
