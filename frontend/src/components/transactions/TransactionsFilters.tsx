import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectField, type SelectOption } from "@/components/ui/select";
import { useCategories } from "@/hooks/use-categories";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { lastMonthsOptions } from "@/lib/period";

export const ALL = "all";

export type TransactionsFiltersValue = {
  search: string;
  type: string;
  categoryId: string;
  period: string;
};

const typeOptions: SelectOption[] = [
  { value: ALL, label: "Todos" },
  { value: "INCOME", label: "Entrada" },
  { value: "EXPENSE", label: "Saída" },
];

const periodOptions: SelectOption[] = [
  { value: ALL, label: "Todos os períodos" },
  ...lastMonthsOptions(12),
];

type TransactionsFiltersProps = {
  value: TransactionsFiltersValue;
  onChange: (value: Partial<TransactionsFiltersValue>) => void;
};

export function TransactionsFilters({ value, onChange }: TransactionsFiltersProps) {
  const { data: categories = [] } = useCategories();
  const categoryOptions: SelectOption[] = [
    { value: ALL, label: "Todas" },
    ...categories.map((category) => ({ value: category.id, label: category.name })),
  ];

  // A busca é digitada localmente e só vira filtro após uma pausa na digitação.
  const [search, setSearch] = useState(value.search);
  const debouncedSearch = useDebouncedValue(search.trim(), 400);

  // Refs com os valores mais recentes: o efeito abaixo roda só quando o texto
  // digitado muda, e não quando o filtro muda por fora (ex.: "Limpar filtros").
  const latest = useRef({ search: value.search, onChange });
  latest.current = { search: value.search, onChange };

  useEffect(() => {
    if (debouncedSearch !== latest.current.search) {
      latest.current.onChange({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  // Mantém o campo sincronizado quando o filtro muda por fora.
  useEffect(() => {
    setSearch((current) => (current.trim() === value.search ? current : value.search));
  }, [value.search]);

  return (
    <Card className="grid grid-cols-1 gap-4 border-gray-200 px-6 pt-5 pb-6 shadow-none sm:grid-cols-2 lg:grid-cols-4">
      <Input
        label="Buscar"
        icon={Search}
        placeholder="Buscar por descrição"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <SelectField
        label="Tipo"
        options={typeOptions}
        value={value.type}
        onValueChange={(type) => onChange({ type })}
      />
      <SelectField
        label="Categoria"
        options={categoryOptions}
        value={value.categoryId}
        onValueChange={(categoryId) => onChange({ categoryId })}
      />
      <SelectField
        label="Período"
        options={periodOptions}
        value={value.period}
        onValueChange={(period) => onChange({ period })}
      />
    </Card>
  );
}
