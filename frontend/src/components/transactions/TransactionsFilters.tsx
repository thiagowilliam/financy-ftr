import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { categoryOptions, periodOptions, typeOptions } from "./mock-data";

export function TransactionsFilters() {
  return (
    <Card className="grid grid-cols-1 gap-4 border-gray-200 px-6 pt-5 pb-6 shadow-none sm:grid-cols-2 lg:grid-cols-4">
      <Input label="Buscar" icon={Search} placeholder="Buscar por descrição" />
      <SelectField label="Tipo" options={typeOptions} defaultValue="all" />
      <SelectField label="Categoria" options={categoryOptions} defaultValue="all" />
      <SelectField label="Período" options={periodOptions} defaultValue="2025-11" />
    </Card>
  );
}
