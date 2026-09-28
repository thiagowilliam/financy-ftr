import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { formatCurrency, formatItemCount } from "@/lib/format";
import { DashboardCardHeader } from "./DashboardCardHeader";
import type { CategorySummary } from "./mock-data";

type CategoriesSummaryProps = {
  categories: CategorySummary[];
};

export function CategoriesSummary({ categories }: CategoriesSummaryProps) {
  return (
    <Card className="overflow-hidden border-gray-200 shadow-none">
      <DashboardCardHeader title="Categorias" linkLabel="Gerenciar" to="/categories" />

      {/* Grid compartilhado (subgrid) mantém as colunas de itens e valores alinhadas. */}
      <ul className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-5 px-6 py-6">
        {categories.map((category) => (
          <li key={category.id} className="col-span-3 grid grid-cols-subgrid items-center">
            <Tag color={category.color} className="justify-self-start">
              {category.name}
            </Tag>
            <span className="whitespace-nowrap text-right text-gray-600 text-sm">
              {formatItemCount(category.itemCount)}
            </span>
            <span className="whitespace-nowrap text-right font-semibold text-gray-800 text-sm">
              {formatCurrency(category.total)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
