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
import { useDeleteTransaction } from "@/hooks/use-transactions";
import { formatCurrency, formatShortDate } from "@/lib/format";
import { getErrorMessage } from "@/lib/graphql/client";
import type { Transaction } from "@/types";

type DeleteTransactionDialogProps = {
  transaction: Transaction | null;
  onOpenChange: (open: boolean) => void;
};

/** Modal de confirmação da exclusão de uma transação. */
export function DeleteTransactionDialog({
  transaction,
  onOpenChange,
}: DeleteTransactionDialogProps) {
  const deleteMutation = useDeleteTransaction();

  const handleConfirm = () => {
    if (!transaction) return;
    deleteMutation.mutate(transaction.id, {
      onSuccess: () => {
        toast.success("Transação excluída", {
          description: `"${transaction.description}" foi excluída com sucesso.`,
        });
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error("Erro ao excluir transação", { description: getErrorMessage(error) });
      },
    });
  };

  return (
    <Dialog
      open={transaction !== null}
      onOpenChange={(open) => {
        // Evita fechar o modal no meio da requisição.
        if (!deleteMutation.isPending) onOpenChange(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir transação</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a transação{" "}
            <strong className="font-semibold text-gray-800">{transaction?.description}</strong>?
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        {transaction && (
          <p className="rounded-lg bg-gray-100 p-3 text-gray-600 text-sm">
            {transaction.type === "INCOME" ? "Entrada" : "Saída"} de{" "}
            <span className="font-medium text-gray-800">
              {formatCurrency(transaction.amount / 100)}
            </span>{" "}
            em {formatShortDate(transaction.date)}
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
