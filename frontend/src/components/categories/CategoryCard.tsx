import { SquarePen, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CategoryIcon } from "@/components/ui/category-icon";
import { IconButton } from "@/components/ui/icon-button";
import { Tag } from "@/components/ui/tag";
import { formatItemCount } from "@/lib/format";
import type { Category } from "./mock-data";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  const { name, description, color, icon, itemCount } = category;

  return (
    <Card className="flex flex-col gap-5 border-gray-200 p-6 shadow-none">
      <div className="flex items-start justify-between gap-4">
        <CategoryIcon icon={icon} color={color} />
        <div className="flex gap-2">
          <IconButton icon={Trash2} variant="danger" aria-label={`Excluir ${name}`} />
          <IconButton icon={SquarePen} aria-label={`Editar ${name}`} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <h2 className="font-semibold text-base text-gray-800">{name}</h2>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Tag color={color}>{name}</Tag>
        <span className="whitespace-nowrap text-gray-600 text-sm">
          {formatItemCount(itemCount)}
        </span>
      </div>
    </Card>
  );
}
