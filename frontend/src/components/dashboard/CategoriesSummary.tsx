import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { formatCurrency } from "@/lib/format";
import { DashboardCardHeader } from "./DashboardCardHeader";
import type { CategorySummary } from "./mock-data";

type CategoriesSummaryProps = {
  categories: CategorySummary[];
};

export function CategoriesSummary({ categories }: CategoriesSummaryProps) {
  return (
    <Card className="overflow-hidden border-gray-200 shadow-none">
      <DashboardCardHeader title="Categorias" linkLabel="Gerenciar" to="/categories" />

      <ul className="flex flex-col gap-5 px-6 py-6">
        {categories.map((category) => (
          <li key={category.id} className="flex items-center gap-4">
            <Tag color={category.color} className="mr-auto">
              {category.name}
            </Tag>
            <span className="whitespace-nowrap text-gray-600 text-sm">
              {category.itemCount} itens
            </span>
            <span className="w-24 whitespace-nowrap text-right font-semibold text-gray-800 text-sm">
              {formatCurrency(category.total)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
