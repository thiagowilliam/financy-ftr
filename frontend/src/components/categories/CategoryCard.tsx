import { SquarePen, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CategoryIcon } from "@/components/ui/category-icon";
import { IconButton } from "@/components/ui/icon-button";
import { Tag } from "@/components/ui/tag";
import { formatItemCount } from "@/lib/format";
import type { Category } from "@/types";
import { getCategoryIcon, hexToPaletteColor } from "./category-options";

type CategoryCardProps = {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
};

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const { name, description, transactionCount } = category;
  const icon = getCategoryIcon(category.icon).icon;
  const color = hexToPaletteColor(category.color);

  return (
    <Card className="flex flex-col gap-5 border-gray-200 p-6 shadow-none">
      <div className="flex items-start justify-between gap-4">
        <CategoryIcon icon={icon} color={color} />
        <div className="flex gap-2">
          <IconButton
            icon={Trash2}
            variant="danger"
            aria-label={`Excluir ${name}`}
            onClick={() => onDelete(category)}
          />
          <IconButton
            icon={SquarePen}
            aria-label={`Editar ${name}`}
            onClick={() => onEdit(category)}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <h2 className="font-semibold text-base text-gray-800">{name}</h2>
        {description && <p className="text-gray-600 text-sm">{description}</p>}
      </div>

      <div className="flex items-center justify-between gap-4">
        <Tag color={color}>{name}</Tag>
        <span className="whitespace-nowrap text-gray-600 text-sm">
          {formatItemCount(transactionCount)}
        </span>
      </div>
    </Card>
  );
}
