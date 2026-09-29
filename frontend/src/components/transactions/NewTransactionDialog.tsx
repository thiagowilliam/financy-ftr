import { Slot } from "@radix-ui/react-slot";
import { type ReactNode, useState } from "react";
import { TransactionFormDialog } from "./TransactionFormDialog";

type NewTransactionDialogProps = {
  /** Elemento que abre o modal (ex.: um botão). */
  children: ReactNode;
};

/** Atalho para abrir o modal de nova transação a partir de qualquer botão. */
export function NewTransactionDialog({ children }: NewTransactionDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Slot onClick={() => setOpen(true)}>{children}</Slot>
      <TransactionFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
