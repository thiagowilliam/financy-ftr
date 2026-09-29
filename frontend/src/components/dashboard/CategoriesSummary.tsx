import { hexToPaletteColor } from "@/components/categories/category-options";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { formatCurrency, formatItemCount } from "@/lib/format";
import type { CategorySummary } from "@/types";
import { DashboardCardHeader } from "./DashboardCardHeader";

type CategoriesSummaryProps = {
  categories: CategorySummary[];
  isLoading: boolean;
  /** Mensagem exibida quando a busca falha. */
  error?: string;
};

const SKELETON_ROWS = Array.from({ length: 5 }, (_, index) => `skeleton-${index}`);

/** Categorias com maior movimentação no mês atual (receitas menos despesas). */
export function CategoriesSummary({ categories, isLoading, error }: CategoriesSummaryProps) {
  return (
    <Card className="overflow-hidden border-gray-200 shadow-none">
      <DashboardCardHeader title="Categorias" linkLabel="Gerenciar" to="/categories" />

      {isLoading ? (
        <ul aria-busy="true" aria-label="Carregando categorias" className="flex flex-col gap-5 p-6">
          {SKELETON_ROWS.map((key) => (
            <li key={key} className="h-7 animate-pulse rounded-full bg-gray-200" />
          ))}
        </ul>
      ) : error ? (
        <p className="px-6 py-10 text-center text-gray-600 text-sm">{error}</p>
      ) : categories.length === 0 ? (
        <p className="px-6 py-10 text-center text-gray-600 text-sm">Nenhuma transação neste mês.</p>
      ) : (
        // Grid compartilhado (subgrid) mantém as colunas de itens e valores alinhadas.
        <ul className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-5 px-6 py-6">
          {categories.map(({ category, transactionCount, income, expense, total }) => (
            <li key={category.id} className="col-span-3 grid grid-cols-subgrid items-center">
              <Tag color={hexToPaletteColor(category.color)} className="justify-self-start">
                {category.name}
              </Tag>
              <span className="whitespace-nowrap text-right text-gray-600 text-sm">
                {formatItemCount(transactionCount)}
              </span>
              <span
                className="whitespace-nowrap text-right font-semibold text-gray-800 text-sm"
                title={`Receitas ${formatCurrency(income / 100)} · Despesas ${formatCurrency(expense / 100)}`}
              >
                {formatCurrency(total / 100)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
