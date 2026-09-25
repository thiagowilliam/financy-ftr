import { ArrowUpDown, Plus, Tag } from "lucide-react";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { categories, overview } from "@/components/categories/mock-data";
import { StatCard } from "@/components/categories/StatCard";
import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";

export function Categories() {
  return (
    <Page className="flex flex-col gap-8 bg-transparent px-0 py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-bold text-2xl text-gray-800">Categorias</h1>
          <p className="text-base text-gray-600">Organize suas transações por categorias</p>
        </div>
        <Button size="sm" icon={Plus}>
          Nova categoria
        </Button>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          label="Total de categorias"
          value={overview.totalCategories}
          icon={Tag}
          iconClassName="text-gray-700"
        />
        <StatCard
          label="Total de transações"
          value={overview.totalTransactions}
          icon={ArrowUpDown}
          iconClassName="text-purple-base"
        />
        <StatCard
          label="Categoria mais utilizada"
          value={overview.mostUsed.name}
          icon={overview.mostUsed.icon}
          iconClassName="text-blue-base"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </section>
    </Page>
  );
}
