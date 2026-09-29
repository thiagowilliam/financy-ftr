import { ArrowUpDown, Plus, Tag } from "lucide-react";
import { useMemo, useState } from "react";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { CategoryFormDialog } from "@/components/categories/CategoryFormDialog";
import { getCategoryIcon } from "@/components/categories/category-options";
import { DeleteCategoryDialog } from "@/components/categories/DeleteCategoryDialog";
import { StatCard } from "@/components/categories/StatCard";
import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCategories } from "@/hooks/use-categories";
import { getErrorMessage } from "@/lib/graphql/client";
import type { Category } from "@/types";

const SKELETON_KEYS = Array.from({ length: 8 }, (_, index) => `skeleton-${index}`);

type FormState = { open: false } | { open: true; category: Category | null };

export function Categories() {
  const { data: categories = [], isPending, isError, error, refetch } = useCategories();
  const [form, setForm] = useState<FormState>({ open: false });
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const overview = useMemo(() => {
    const totalTransactions = categories.reduce((sum, item) => sum + item.transactionCount, 0);
    const mostUsed = categories.reduce<Category | null>(
      (best, item) =>
        item.transactionCount > 0 && item.transactionCount > (best?.transactionCount ?? 0)
          ? item
          : best,
      null,
    );
    return { totalCategories: categories.length, totalTransactions, mostUsed };
  }, [categories]);

  const openCreateDialog = () => setForm({ open: true, category: null });
  const openEditDialog = (category: Category) => setForm({ open: true, category });

  return (
    <Page className="flex flex-col gap-8 bg-transparent px-0 py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-bold text-2xl text-gray-800">Categorias</h1>
          <p className="text-base text-gray-600">Organize suas transações por categorias</p>
        </div>
        <Button size="sm" icon={Plus} onClick={openCreateDialog}>
          Nova categoria
        </Button>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          label="Total de categorias"
          value={isPending ? "—" : overview.totalCategories}
          icon={Tag}
          iconClassName="text-gray-700"
        />
        <StatCard
          label="Total de transações"
          value={isPending ? "—" : overview.totalTransactions}
          icon={ArrowUpDown}
          iconClassName="text-purple-base"
        />
        <StatCard
          label="Categoria mais utilizada"
          value={overview.mostUsed?.name ?? "—"}
          icon={getCategoryIcon(overview.mostUsed?.icon).icon}
          iconClassName="text-blue-base"
        />
      </section>

      {isPending ? (
        <section
          aria-busy="true"
          aria-label="Carregando categorias"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {SKELETON_KEYS.map((key) => (
            <Card
              key={key}
              className="h-48 animate-pulse border-gray-200 bg-gray-200 shadow-none"
            />
          ))}
        </section>
      ) : isError ? (
        <Card className="flex flex-col items-center gap-4 border-gray-200 p-8 text-center shadow-none">
          <p className="text-gray-600 text-sm">
            Não foi possível carregar as categorias. {getErrorMessage(error)}
          </p>
          <Button size="sm" variant="secondary" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </Card>
      ) : categories.length === 0 ? (
        <Card className="flex flex-col items-center gap-4 border-gray-200 p-8 text-center shadow-none">
          <p className="text-gray-600 text-sm">Você ainda não possui categorias.</p>
          <Button size="sm" icon={Plus} onClick={openCreateDialog}>
            Criar primeira categoria
          </Button>
        </Card>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={openEditDialog}
              onDelete={setCategoryToDelete}
            />
          ))}
        </section>
      )}

      <CategoryFormDialog
        open={form.open}
        category={form.open ? form.category : null}
        onOpenChange={(open) => {
          if (!open) setForm({ open: false });
        }}
      />
      <DeleteCategoryDialog
        category={categoryToDelete}
        onOpenChange={(open) => {
          if (!open) setCategoryToDelete(null);
        }}
      />
    </Page>
  );
}
