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
import type { TransactionKind } from "@/components/ui/transaction-type";
import { TransactionTypeToggle } from "@/components/ui/transaction-type-toggle";
import { useCategories, useCreateCategory, useUpdateCategory } from "@/hooks/use-categories";
import { GraphQLRequestError, getErrorMessage } from "@/lib/graphql/client";
import type { PaletteColor } from "@/styles/tokens";
import type { Category, CategoryInput } from "@/types";
import { CategoryColorPicker } from "./CategoryColorPicker";
import { CategoryIconPicker } from "./CategoryIconPicker";
import {
  categoryColorOptions,
  categoryIconOptions,
  getCategoryIcon,
  hexToPaletteColor,
  paletteColorToHex,
} from "./category-options";

const NAME_MIN_LENGTH = 2;
const DESCRIPTION_MAX_LENGTH = 120;

const normalizeName = (name: string) => name.trim().toLocaleLowerCase("pt-BR");

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Quando informada, o modal edita esta categoria; caso contrário, cria uma nova. */
  category?: Category | null;
};

/** Modal de criação e edição de categoria. */
export function CategoryFormDialog({ open, onOpenChange, category }: CategoryFormDialogProps) {
  const isEditing = Boolean(category);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar categoria" : "Nova categoria"}</DialogTitle>
          <DialogDescription>Organize suas transações com categorias</DialogDescription>
        </DialogHeader>

        {/* O conteúdo só é montado com o modal aberto, então o estado reinicia a cada abertura. */}
        <CategoryForm category={category} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

type CategoryFormProps = {
  category?: Category | null;
  onSuccess: () => void;
};

function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [type, setType] = useState<TransactionKind>(
    category?.type === "INCOME" ? "income" : "expense",
  );
  const [icon, setIcon] = useState(
    category ? getCategoryIcon(category.icon).value : categoryIconOptions[0].value,
  );
  const [color, setColor] = useState<PaletteColor>(
    category ? hexToPaletteColor(category.color) : categoryColorOptions[0].value,
  );
  const [nameError, setNameError] = useState<string>();

  const { data: categories = [] } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const validateName = (value: string): string | undefined => {
    const trimmed = value.trim();
    if (trimmed.length < NAME_MIN_LENGTH) {
      return `O título deve ter no mínimo ${NAME_MIN_LENGTH} caracteres.`;
    }
    const duplicate = categories.find(
      (item) => item.id !== category?.id && normalizeName(item.name) === normalizeName(trimmed),
    );
    if (duplicate) {
      return `Já existe uma categoria chamada "${duplicate.name}".`;
    }
    return undefined;
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (nameError) setNameError(validateName(value));
  };

  const handleError = (error: unknown) => {
    // Conflito de nome detectado pelo backend (ex.: lista desatualizada) vira erro do campo.
    if (error instanceof GraphQLRequestError && error.code === "CONFLICT") {
      setNameError(error.message);
    }
    toast.error(category ? "Erro ao editar categoria" : "Erro ao criar categoria", {
      description: getErrorMessage(error),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateName(name);
    setNameError(error);
    if (error) return;

    const input: CategoryInput = {
      name: name.trim(),
      description: description.trim() || null,
      type: type === "income" ? "INCOME" : "EXPENSE",
      icon,
      color: paletteColorToHex(color),
    };

    if (category) {
      updateMutation.mutate(
        { id: category.id, input },
        {
          onSuccess: (updated) => {
            toast.success("Categoria atualizada", {
              description: `"${updated.name}" foi atualizada com sucesso.`,
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
        toast.success("Categoria criada", {
          description: `"${created.name}" foi criada com sucesso.`,
        });
        onSuccess();
      },
      onError: handleError,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        id="category-title"
        label="Título"
        placeholder="Ex. Alimentação"
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        error={nameError}
        autoComplete="off"
        required
      />
      <Input
        id="category-description"
        label="Descrição"
        placeholder="Descrição da categoria"
        helperText="Opcional"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={DESCRIPTION_MAX_LENGTH}
      />
      <TransactionTypeToggle value={type} onValueChange={setType} name="category-type" />
      <CategoryIconPicker value={icon} onValueChange={setIcon} />
      <CategoryColorPicker value={color} onValueChange={setColor} />

      <DialogFooter className="mt-2">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
