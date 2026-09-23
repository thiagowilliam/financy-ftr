import {
  BriefcaseBusiness,
  Car,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  type LucideIcon,
  Plus,
  ReceiptText,
  Search,
  ShoppingCart,
  SquarePen,
  Trash,
  Utensils,
  Wallet,
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { PaginationButton } from "@/components/ui/pagination-button";
import { SelectField, type SelectOption } from "@/components/ui/select";
import { Tag, type TagColor } from "@/components/ui/tag";
import { type TransactionKind, TransactionType } from "@/components/ui/transaction-type";

type Category = { label: string; color: TagColor; icon: LucideIcon };

const categories: Record<string, Category> = {
  alimentacao: { label: "Alimentação", color: "blue", icon: Utensils },
  transporte: { label: "Transporte", color: "purple", icon: Car },
  mercado: { label: "Mercado", color: "orange", icon: ShoppingCart },
  salario: { label: "Salário", color: "green", icon: BriefcaseBusiness },
  saude: { label: "Saúde", color: "red", icon: HeartPulse },
  utilidades: { label: "Utilidades", color: "yellow", icon: ReceiptText },
};

type Transaction = {
  id: number;
  description: string;
  date: string;
  category: keyof typeof categories;
  type: TransactionKind;
  amount: number;
};

const transactions: Transaction[] = [
  {
    id: 1,
    description: "Salário mensal",
    date: "01/09/26",
    category: "salario",
    type: "income",
    amount: 8500,
  },
  {
    id: 2,
    description: "Jantar no restaurante",
    date: "03/09/26",
    category: "alimentacao",
    type: "expense",
    amount: 89.5,
  },
  {
    id: 3,
    description: "Posto de gasolina",
    date: "04/09/26",
    category: "transporte",
    type: "expense",
    amount: 250,
  },
  {
    id: 4,
    description: "Compras no mercado",
    date: "06/09/26",
    category: "mercado",
    type: "expense",
    amount: 540.9,
  },
  {
    id: 5,
    description: "Farmácia",
    date: "08/09/26",
    category: "saude",
    type: "expense",
    amount: 72.3,
  },
  {
    id: 6,
    description: "Conta de luz",
    date: "10/09/26",
    category: "utilidades",
    type: "expense",
    amount: 180,
  },
  {
    id: 7,
    description: "Freelance",
    date: "12/09/26",
    category: "salario",
    type: "income",
    amount: 1200,
  },
  {
    id: 8,
    description: "Uber",
    date: "13/09/26",
    category: "transporte",
    type: "expense",
    amount: 32.4,
  },
  {
    id: 9,
    description: "Padaria",
    date: "14/09/26",
    category: "alimentacao",
    type: "expense",
    amount: 18.75,
  },
  {
    id: 10,
    description: "Consulta médica",
    date: "15/09/26",
    category: "saude",
    type: "expense",
    amount: 300,
  },
];

const PAGE_SIZE = 4;

const typeOptions: SelectOption[] = [
  { value: "all", label: "Todos" },
  { value: "income", label: "Entrada" },
  { value: "expense", label: "Saída" },
];

const categoryOptions: SelectOption[] = [
  { value: "all", label: "Todas" },
  ...Object.entries(categories).map(([value, { label }]) => ({ value, label })),
];

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function ExamplePage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [formError, setFormError] = useState<string>();

  const filtered = useMemo(
    () =>
      transactions.filter(
        (t) =>
          t.description.toLowerCase().includes(query.toLowerCase()) &&
          (type === "all" || t.type === type) &&
          (category === "all" || t.category === category),
      ),
    [query, type, category],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function resetPage<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setFormError(
      String(data.get("description") ?? "").trim() ? undefined : "Informe uma descrição",
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-gray-200 border-b bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo title="Financy" />
          <nav aria-label="Principal" className="flex items-center gap-6">
            <Link asChild>
              <RouterLink to="/">Style guide</RouterLink>
            </Link>
            <Link href="#transacoes" aria-current="page" className="underline">
              Transações
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-bold text-2xl text-gray-800">Transações</h1>
            <p className="text-gray-500 text-sm">Gerencie todas as suas entradas e saídas</p>
          </div>
          <Button
            size="sm"
            icon={Plus}
            onClick={() => document.getElementById("description")?.focus()}
          >
            Nova transação
          </Button>
        </div>

        <section aria-label="Filtros" className="grid gap-4 rounded-xl bg-white p-6 md:grid-cols-3">
          <Input
            label="Buscar"
            icon={Search}
            placeholder="Buscar por descrição"
            value={query}
            onChange={(e) => resetPage(setQuery)(e.target.value)}
          />
          <SelectField
            label="Tipo"
            options={typeOptions}
            value={type}
            onValueChange={resetPage(setType)}
          />
          <SelectField
            label="Categoria"
            options={categoryOptions}
            value={category}
            onValueChange={resetPage(setCategory)}
          />
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section
            id="transacoes"
            aria-label="Lista de transações"
            className="overflow-hidden rounded-xl bg-white"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-gray-200 border-b text-gray-500 text-xs uppercase">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium">
                      Descrição
                    </th>
                    <th scope="col" className="px-4 py-4 font-medium">
                      Data
                    </th>
                    <th scope="col" className="px-4 py-4 font-medium">
                      Categoria
                    </th>
                    <th scope="col" className="px-4 py-4 font-medium">
                      Tipo
                    </th>
                    <th scope="col" className="px-4 py-4 text-right font-medium">
                      Valor
                    </th>
                    <th scope="col" className="px-6 py-4 text-right font-medium">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((t) => {
                    const cat = categories[t.category];
                    const CategoryIcon = cat?.icon ?? ReceiptText;
                    return (
                      <tr key={t.id} className="border-gray-200 border-b last:border-b-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                              <CategoryIcon aria-hidden="true" className="size-4" />
                            </span>
                            <span className="font-medium text-gray-800">{t.description}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600">{t.date}</td>
                        <td className="px-4 py-4">
                          <Tag color={cat?.color}>{cat?.label}</Tag>
                        </td>
                        <td className="px-4 py-4">
                          <TransactionType type={t.type} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-right font-bold text-gray-800">
                          {t.type === "expense" ? "- " : "+ "}
                          {currency.format(t.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <IconButton
                              icon={Trash}
                              variant="danger"
                              aria-label={`Excluir ${t.description}`}
                            />
                            <IconButton icon={SquarePen} aria-label={`Editar ${t.description}`} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {visible.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                        Nenhuma transação encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-4 border-gray-200 border-t px-6 py-4">
              <p className="text-gray-500 text-sm">
                {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
              </p>
              <nav aria-label="Paginação" className="flex items-center gap-2">
                <PaginationButton
                  aria-label="Página anterior"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ChevronLeft aria-hidden="true" />
                </PaginationButton>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <PaginationButton key={n} isActive={n === currentPage} onClick={() => setPage(n)}>
                    {n}
                  </PaginationButton>
                ))}
                <PaginationButton
                  aria-label="Próxima página"
                  disabled={currentPage === pageCount}
                  onClick={() => setPage(currentPage + 1)}
                >
                  <ChevronRight aria-hidden="true" />
                </PaginationButton>
              </nav>
            </footer>
          </section>

          <aside className="flex flex-col gap-6 self-start rounded-xl bg-white p-6">
            <div>
              <h2 className="font-bold text-gray-800 text-lg">Nova transação</h2>
              <p className="text-gray-500 text-sm">Registre sua despesa ou receita</p>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
              <Input
                id="description"
                name="description"
                label="Descrição"
                icon={ReceiptText}
                placeholder="Ex.: Almoço"
                error={formError}
              />
              <Input
                name="amount"
                label="Valor"
                icon={Wallet}
                placeholder="R$ 0,00"
                inputMode="decimal"
                helperText="Use vírgula para os centavos"
              />
              <SelectField
                label="Categoria"
                placeholder="Selecione"
                options={categoryOptions.slice(1)}
              />
              <Input label="Conta" defaultValue="Carteira principal" disabled />
              <div className="flex flex-col gap-2">
                <Button type="submit">Salvar</Button>
                <Button type="reset" variant="secondary" onClick={() => setFormError(undefined)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </aside>
        </div>
      </main>
    </div>
  );
}
