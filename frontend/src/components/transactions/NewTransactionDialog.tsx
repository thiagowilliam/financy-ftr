import { type ReactNode, useState } from "react";
import { categories } from "@/components/categories/mock-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import type { TransactionKind } from "@/components/ui/transaction-type";
import { TransactionTypeToggle } from "@/components/ui/transaction-type-toggle";

const categoryOptions = categories.map((category) => ({
  value: category.id,
  label: category.name,
}));

type NewTransactionDialogProps = {
  /** Elemento que abre o modal (renderizado com `asChild`). */
  children: ReactNode;
};

export function NewTransactionDialog({ children }: NewTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TransactionKind>("expense");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrar com a mutation de criação de transação.
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova transação</DialogTitle>
          <DialogDescription>Registre sua despesa ou receita</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TransactionTypeToggle value={type} onValueChange={setType} />

          <Input
            id="transaction-description"
            label="Descrição"
            placeholder="Ex. Almoço no restaurante"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input id="transaction-date" label="Data" type="date" />
            <Input
              id="transaction-amount"
              label="Valor"
              startText="R$"
              placeholder="0,00"
              inputMode="decimal"
            />
          </div>

          <SelectField
            id="transaction-category"
            label="Categoria"
            placeholder="Selecione"
            options={categoryOptions}
          />

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
