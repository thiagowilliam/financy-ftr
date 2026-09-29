import { useQuery } from "@tanstack/react-query";
import { dashboardSummaryQueryOptions } from "@/api/dashboard";
import { currentMonthRange } from "@/lib/period";

const CATEGORIES_LIMIT = 5;

/** Resumo do mês atual: saldo total, receitas/despesas do mês e categorias com mais gastos. */
export function useDashboardSummary() {
  return useQuery(
    dashboardSummaryQueryOptions({ ...currentMonthRange(), categoriesLimit: CATEGORIES_LIMIT }),
  );
}
