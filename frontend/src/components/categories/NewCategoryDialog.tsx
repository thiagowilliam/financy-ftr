import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { PaletteColor } from "@/styles/tokens";
import { CategoryColorPicker } from "./CategoryColorPicker";
import { CategoryIconPicker } from "./CategoryIconPicker";
import { categoryColorOptions, categoryIconOptions } from "./category-options";

type NewCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NewCategoryDialog({ open, onOpenChange }: NewCategoryDialogProps) {
  const [icon, setIcon] = useState(categoryIconOptions[0].value);
  const [color, setColor] = useState<PaletteColor>(categoryColorOptions[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrar com a mutation de criação de categoria.
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova categoria</DialogTitle>
          <DialogDescription>Organize suas transações com categorias</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input id="category-title" label="Título" placeholder="Ex. Alimentação" />
          <Input
            id="category-description"
            label="Descrição"
            placeholder="Descrição da categoria"
            helperText="Opcional"
          />
          <CategoryIconPicker value={icon} onValueChange={setIcon} />
          <CategoryColorPicker value={color} onValueChange={setColor} />

          <DialogFooter className="mt-2">
            <Button type="submit" className="w-full">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
