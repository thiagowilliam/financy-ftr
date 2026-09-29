import { useState } from "react";
import { toast } from "sonner";
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
import { SelectField } from "@/components/ui/select";
import type { TransactionKind } from "@/components/ui/transaction-type";
import { TransactionTypeToggle } from "@/components/ui/transaction-type-toggle";
import { useCategories } from "@/hooks/use-categories";
import { useCreateTransaction, useUpdateTransaction } from "@/hooks/use-transactions";
import {
  centsToInputValue,
  fromDateInputValue,
  parseCurrencyToCents,
  toDateInputValue,
} from "@/lib/format";
import { getErrorMessage } from "@/lib/graphql/client";
import type { Transaction, TransactionInput } from "@/types";

const DESCRIPTION_MIN_LENGTH = 2;

type TransactionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Quando informada, o modal edita esta transação; caso contrário, cria uma nova. */
  transaction?: Transaction | null;
};

/** Modal de criação e edição de transação. */
export function TransactionFormDialog({
  open,
  onOpenChange,
  transaction,
}: TransactionFormDialogProps) {
  const isEditing = Boolean(transaction);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar transação" : "Nova transação"}</DialogTitle>
          <DialogDescription>Registre sua despesa ou receita</DialogDescription>
        </DialogHeader>

        {/* O conteúdo só é montado com o modal aberto, então o estado reinicia a cada abertura. */}
        <TransactionForm transaction={transaction} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

type FormErrors = Partial<Record<"description" | "date" | "amount" | "categoryId", string>>;

type TransactionFormProps = {
  transaction?: Transaction | null;
  onSuccess: () => void;
};

function todayInputValue() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function TransactionForm({ transaction, onSuccess }: TransactionFormProps) {
  const [type, setType] = useState<TransactionKind>(
    transaction?.type === "INCOME" ? "income" : "expense",
  );
  const [description, setDescription] = useState(transaction?.description ?? "");
  const [date, setDate] = useState(
    transaction ? toDateInputValue(transaction.date) : todayInputValue(),
  );
  const [amount, setAmount] = useState(transaction ? centsToInputValue(transaction.amount) : "");
  const [categoryId, setCategoryId] = useState(transaction?.category?.id ?? "");
  const [errors, setErrors] = useState<FormErrors>({});

  const { data: categories = [], isPending: isLoadingCategories } = useCategories();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (description.trim().length < DESCRIPTION_MIN_LENGTH) {
      next.description = `A descrição deve ter no mínimo ${DESCRIPTION_MIN_LENGTH} caracteres.`;
    }
    if (!date) {
      next.date = "Informe a data.";
    }
    const cents = parseCurrencyToCents(amount);
    if (cents === null || cents <= 0) {
      next.amount = "Informe um valor maior que zero.";
    }
    if (!categoryId) {
      next.categoryId = "Selecione uma categoria.";
    }
    return next;
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleError = (error: unknown) => {
    toast.error(transaction ? "Erro ao editar transação" : "Erro ao criar transação", {
      description: getErrorMessage(error),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    const input: TransactionInput = {
      description: description.trim(),
      amount: parseCurrencyToCents(amount) ?? 0,
      type: type === "income" ? "INCOME" : "EXPENSE",
      date: fromDateInputValue(date),
      categoryId: categoryId || null,
    };

    if (transaction) {
      updateMutation.mutate(
        { id: transaction.id, input },
        {
          onSuccess: (updated) => {
            toast.success("Transação atualizada", {
              description: `"${updated.description}" foi atualizada com sucesso.`,
            });
            onSuccess();
          },
          onError: handleError,
        },
      );
      return;
    }

    createMutation.mutate(input, {
      onSuccess: (created) => {
        toast.success("Transação criada", {
          description: `"${created.description}" foi criada com sucesso.`,
        });
        onSuccess();
      },
      onError: handleError,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <TransactionTypeToggle value={type} onValueChange={setType} />

      <Input
        id="transaction-description"
        label="Descrição"
        placeholder="Ex. Almoço no restaurante"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          clearError("description");
        }}
        error={errors.description}
        autoComplete="off"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="transaction-date"
          label="Data"
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            clearError("date");
          }}
          error={errors.date}
        />
        <Input
          id="transaction-amount"
          label="Valor"
          startText="R$"
          placeholder="0,00"
          inputMode="decimal"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            clearError("amount");
          }}
          onBlur={() => {
            const cents = parseCurrencyToCents(amount);
            if (cents !== null && cents > 0) setAmount(centsToInputValue(cents));
          }}
          error={errors.amount}
          autoComplete="off"
        />
      </div>

      <SelectField
        id="transaction-category"
        label="Categoria"
        placeholder={isLoadingCategories ? "Carregando..." : "Selecione"}
        options={categoryOptions}
        value={categoryId || undefined}
        onValueChange={(value) => {
          setCategoryId(value);
          clearError("categoryId");
        }}
        error={errors.categoryId}
        disabled={isLoadingCategories}
      />

      <DialogFooter className="mt-2">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
