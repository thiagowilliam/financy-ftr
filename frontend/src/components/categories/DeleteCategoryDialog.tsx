import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteCategory } from "@/hooks/use-categories";
import { getErrorMessage } from "@/lib/graphql/client";
import type { Category } from "@/types";

type DeleteCategoryDialogProps = {
  category: Category | null;
  onOpenChange: (open: boolean) => void;
};

/** Modal de confirmação da exclusão de uma categoria. */
export function DeleteCategoryDialog({ category, onOpenChange }: DeleteCategoryDialogProps) {
  const deleteMutation = useDeleteCategory();

  const handleConfirm = () => {
    if (!category) return;
    deleteMutation.mutate(category.id, {
      onSuccess: () => {
        toast.success("Categoria excluída", {
          description: `"${category.name}" foi excluída com sucesso.`,
        });
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error("Erro ao excluir categoria", { description: getErrorMessage(error) });
      },
    });
  };

  const transactionCount = category?.transactionCount ?? 0;

  return (
    <Dialog
      open={category !== null}
      onOpenChange={(open) => {
        // Evita fechar o modal no meio da requisição.
        if (!deleteMutation.isPending) onOpenChange(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir categoria</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a categoria{" "}
            <strong className="font-semibold text-gray-800">{category?.name}</strong>? Esta ação não
            pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        {transactionCount > 0 && (
          <p className="rounded-lg bg-gray-100 p-3 text-gray-600 text-sm">
            {transactionCount === 1
              ? "1 transação vinculada ficará sem categoria."
              : `${transactionCount} transações vinculadas ficarão sem categoria.`}
          </p>
        )}

        <DialogFooter className="sm:flex-row-reverse">
          <Button
            className="w-full bg-danger hover:bg-red-dark"
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
          </Button>
          <DialogClose asChild>
            <Button variant="secondary" className="w-full" disabled={deleteMutation.isPending}>
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
