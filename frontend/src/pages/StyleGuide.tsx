import {
  ArrowUpDown,
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleArrowDown,
  CircleArrowUp,
  Dumbbell,
  Eye,
  EyeClosed,
  Gift,
  HeartPulse,
  House,
  Lock,
  LogIn,
  LogOut,
  type LucideIcon,
  Mail,
  PawPrint,
  PiggyBank,
  Plus,
  ReceiptText,
  Search,
  ShoppingBasket,
  ShoppingCart,
  SquarePen,
  Tag as TagIcon,
  Ticket,
  ToolCase,
  Trash,
  User,
  UserPlus,
  Utensils,
  Wallet,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { PaginationButton } from "@/components/ui/pagination-button";
import {
  SelectField,
  type SelectOption,
  selectContentClassName,
  selectItemClassName,
} from "@/components/ui/select";
import { Tag, type TagColor } from "@/components/ui/tag";
import { TransactionType } from "@/components/ui/transaction-type";
import { cn } from "@/lib/utils";
import { colors, links, type PaletteColor } from "@/styles/tokens";

/* -------------------------------------------------------------------------- */
/*                                   Layout                                   */
/* -------------------------------------------------------------------------- */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`section-${title}`} className="rounded-xl bg-white p-10">
      <h2 id={`section-${title}`} className="mb-8 font-bold text-2xl text-gray-800">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-4 font-medium text-gray-500 text-sm">{children}</h3>;
}

function Showcase({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
      <div className="flex flex-col gap-6 rounded-lg border border-purple-base border-dashed p-6">
        {children}
      </div>
    </div>
  );
}

function ShowcaseRow({ state, children }: { state: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-4">
        {children}
      </div>
      <span className="w-28 shrink-0 font-mono text-gray-500 text-xs">{state}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Cores                                   */
/* -------------------------------------------------------------------------- */

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn("h-8 w-24 rounded-lg", hex === colors.white && "border border-gray-300")}
        style={{ backgroundColor: hex }}
      />
      <span className="font-bold text-gray-800 text-xs">{hex}</span>
      <span className="text-gray-500 text-xs">{name}</span>
    </div>
  );
}

function SwatchGroup({ title, items }: { title: string; items: { name: string; hex: string }[] }) {
  return (
    <div>
      <SubTitle>{title}</SubTitle>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <Swatch key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}

function PaletteRow({ color }: { color: PaletteColor }) {
  const shades = colors[color];
  return (
    <div className="flex gap-3">
      {(["dark", "base", "light"] as const).map((shade) => (
        <Swatch key={shade} name={`${color}-${shade}`} hex={shades[shade]} />
      ))}
    </div>
  );
}

function ColorsSection() {
  const brand = (["dark", "base"] as const).map((k) => ({
    name: `brand-${k}`,
    hex: colors.brand[k],
  }));
  const grays = ([800, 700, 600, 500, 400, 300, 200, 100] as const).map((k) => ({
    name: `gray-${k}`,
    hex: colors.gray[k],
  }));

  return (
    <Section title="Cores">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        <SwatchGroup title="Brand" items={brand} />
        <SwatchGroup title="Grayscale" items={grays} />
        <SwatchGroup
          title="Neutral"
          items={[
            { name: "black", hex: colors.black },
            { name: "white", hex: colors.white },
          ]}
        />
        <SwatchGroup
          title="Feedback"
          items={[
            { name: "danger", hex: colors.danger },
            { name: "success", hex: colors.success },
          ]}
        />
      </div>

      <div className="mt-10">
        <SubTitle>Colors</SubTitle>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            {(["blue", "pink", "orange", "green"] as const).map((c) => (
              <PaletteRow key={c} color={c} />
            ))}
          </div>
          <div className="flex flex-col gap-6">
            {(["purple", "red", "yellow"] as const).map((c) => (
              <PaletteRow key={c} color={c} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Tipografia, Ícones, Vetores                        */
/* -------------------------------------------------------------------------- */

function TypographySection() {
  return (
    <Section title="Tipografia">
      <p className="text-gray-500 text-sm">Font Family</p>
      <p className="font-bold text-5xl text-gray-800">Inter</p>
      <div className="mt-6 flex flex-col gap-2 text-gray-800">
        <p className="text-base">Base 16px · Regular 400</p>
        <p className="font-medium text-sm">Sm 14px · Medium 500</p>
        <p className="font-bold text-xs">Xs 12px · Bold 700</p>
      </div>
      <p className="mt-6 text-gray-500 text-sm">
        Esta fonte pode ser acessada em{" "}
        <Link href={links.googleFonts} target="_blank" rel="noreferrer">
          Google Fonts
        </Link>
      </p>
    </Section>
  );
}

const iconRows: { name: string; icon: LucideIcon }[][] = [
  [
    { name: "Mail", icon: Mail },
    { name: "Lock", icon: Lock },
    { name: "User", icon: User },
    { name: "UserPlus", icon: UserPlus },
    { name: "LogIn", icon: LogIn },
    { name: "LogOut", icon: LogOut },
    { name: "Eye", icon: Eye },
    { name: "EyeClosed", icon: EyeClosed },
    { name: "PiggyBank", icon: PiggyBank },
    { name: "BriefcaseBusiness", icon: BriefcaseBusiness },
    { name: "Utensils", icon: Utensils },
    { name: "ShoppingCart", icon: ShoppingCart },
    { name: "Car", icon: Car },
    { name: "HeartPulse", icon: HeartPulse },
    { name: "Ticket", icon: Ticket },
    { name: "ToolCase", icon: ToolCase },
  ],
  [
    { name: "Search", icon: Search },
    { name: "SquarePen", icon: SquarePen },
    { name: "Trash", icon: Trash },
    { name: "X", icon: X },
    { name: "Plus", icon: Plus },
    { name: "Wallet", icon: Wallet },
    { name: "ChevronLeft", icon: ChevronLeft },
    { name: "ChevronRight", icon: ChevronRight },
    { name: "ChevronDown", icon: ChevronDown },
    { name: "ChevronUp", icon: ChevronUp },
    { name: "CircleArrowDown", icon: CircleArrowDown },
    { name: "CircleArrowUp", icon: CircleArrowUp },
    { name: "ArrowUpDown", icon: ArrowUpDown },
    { name: "Tag", icon: TagIcon },
    { name: "BookOpen", icon: BookOpen },
    { name: "Gift", icon: Gift },
  ],
  [
    { name: "Dumbbell", icon: Dumbbell },
    { name: "House", icon: House },
    { name: "PawPrint", icon: PawPrint },
    { name: "ShoppingBasket", icon: ShoppingBasket },
    { name: "BaggageClaim", icon: BaggageClaim },
    { name: "ReceiptText", icon: ReceiptText },
    { name: "Check", icon: Check },
  ],
];

function IconsSection() {
  return (
    <Section title="Ícones">
      <ul className="flex flex-col gap-4">
        {iconRows.map((row) => (
          <li key={row[0]?.name}>
            <ul className="flex flex-wrap gap-4 text-gray-700">
              {row.map(({ name, icon: Icon }) => (
                <li key={name} title={name}>
                  <Icon className="size-4" strokeWidth={2} aria-label={name} role="img" />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-gray-500 text-sm">
        Os ícones podem ser acessados em{" "}
        <Link href={links.lucide} target="_blank" rel="noreferrer">
          Lucide Icons
        </Link>
      </p>
    </Section>
  );
}

function VectorsSection() {
  return (
    <Section title="Vetores">
      <div className="flex flex-wrap items-center gap-10">
        <Logo variant="full" title="Financy" />
        <Logo variant="symbol" title="Financy (símbolo)" />
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Componentes                                */
/* -------------------------------------------------------------------------- */

const categoryOptions: SelectOption[] = [
  { value: "alimentacao", label: "Alimentação" },
  { value: "transporte", label: "Transporte" },
  { value: "mercado", label: "Mercado" },
  { value: "investimento", label: "Investimento" },
];

const tagColors: { color: TagColor; label: string }[] = [
  { color: "gray", label: "Gray" },
  { color: "blue", label: "Blue" },
  { color: "purple", label: "Purple" },
  { color: "pink", label: "Pink" },
  { color: "red", label: "Red" },
  { color: "orange", label: "Orange" },
  { color: "yellow", label: "Yellow" },
  { color: "green", label: "Green" },
];

function DropdownPreview() {
  // Réplica estática do SelectContent aberto (o dropdown real é renderizado em portal).
  return (
    <div className={cn(selectContentClassName, "w-72")} aria-hidden="true">
      {categoryOptions.map((option, index) => (
        <div key={option.value} className={cn(selectItemClassName, index === 1 && "bg-gray-100")}>
          {option.label}
          {index === 0 && <Check className="absolute right-3 size-4 text-success" />}
        </div>
      ))}
    </div>
  );
}

function ComponentsSection() {
  return (
    <Section title="Componentes">
      <div className="flex flex-col gap-12">
        <Showcase title="Input">
          <ShowcaseRow state="Empty">
            <Input
              wrapperClassName="w-72"
              label="Label"
              icon={Mail}
              placeholder="Placeholder"
              helperText="Helper text"
            />
          </ShowcaseRow>
          <ShowcaseRow state="Active">
            <Input
              wrapperClassName="w-72"
              label="Label"
              icon={Mail}
              defaultValue="Digitando"
              helperText="Helper text"
              data-demo-state="focus"
            />
          </ShowcaseRow>
          <ShowcaseRow state="Filled">
            <Input
              wrapperClassName="w-72"
              label="Label"
              icon={Mail}
              defaultValue="Preenchido"
              helperText="Helper text"
            />
          </ShowcaseRow>
          <ShowcaseRow state="Error">
            <Input
              wrapperClassName="w-72"
              label="Label"
              icon={Mail}
              defaultValue="Inválido"
              error="Mensagem de erro"
            />
          </ShowcaseRow>
          <ShowcaseRow state="Disabled">
            <Input
              wrapperClassName="w-72"
              label="Label"
              icon={Mail}
              placeholder="Placeholder"
              helperText="Helper text"
              disabled
            />
          </ShowcaseRow>
        </Showcase>

        <Showcase title="Select">
          <ShowcaseRow state="Empty">
            <SelectField
              className="w-72"
              label="Label"
              icon={Wallet}
              placeholder="Selecione"
              options={categoryOptions}
              helperText="Helper text"
            />
          </ShowcaseRow>
          <ShowcaseRow state="Active">
            <SelectField
              className="w-72"
              label="Label"
              icon={Wallet}
              defaultValue="alimentacao"
              options={categoryOptions}
              data-demo-state="open"
            />
          </ShowcaseRow>
          <ShowcaseRow state="Dropdown">
            <DropdownPreview />
          </ShowcaseRow>
          <ShowcaseRow state="Filled">
            <SelectField
              className="w-72"
              label="Label"
              icon={Wallet}
              defaultValue="alimentacao"
              options={categoryOptions}
              helperText="Helper text"
            />
          </ShowcaseRow>
          <ShowcaseRow state="Error">
            <SelectField
              className="w-72"
              label="Label"
              icon={Wallet}
              placeholder="Selecione"
              options={categoryOptions}
              error="Mensagem de erro"
            />
          </ShowcaseRow>
          <ShowcaseRow state="Disabled">
            <SelectField
              className="w-72"
              label="Label"
              icon={Wallet}
              placeholder="Selecione"
              options={categoryOptions}
              helperText="Helper text"
              disabled
            />
          </ShowcaseRow>
        </Showcase>

        {(["primary", "secondary"] as const).map((variant) => (
          <Showcase
            key={variant}
            title={`Label Button · ${variant === "primary" ? "Primary" : "Secondary"}`}
          >
            {(["md", "sm"] as const).map((size) => (
              <div key={size} className="contents">
                <ShowcaseRow state={`${size === "md" ? "Md" : "Sm"} / Default`}>
                  <Button className="w-72" variant={variant} size={size} icon={Plus}>
                    Label
                  </Button>
                </ShowcaseRow>
                <ShowcaseRow state={`${size === "md" ? "Md" : "Sm"} / Hover`}>
                  <Button
                    className="w-72"
                    variant={variant}
                    size={size}
                    icon={Plus}
                    data-demo-state="hover"
                  >
                    Label
                  </Button>
                </ShowcaseRow>
                <ShowcaseRow state={`${size === "md" ? "Md" : "Sm"} / Disabled`}>
                  <Button className="w-72" variant={variant} size={size} icon={Plus} disabled>
                    Label
                  </Button>
                </ShowcaseRow>
              </div>
            ))}
          </Showcase>
        ))}

        <Showcase title="Icon Button">
          <ShowcaseRow state="Default">
            <IconButton icon={SquarePen} aria-label="Editar" />
            <IconButton icon={Trash} variant="danger" aria-label="Excluir" />
          </ShowcaseRow>
          <ShowcaseRow state="Hover">
            <IconButton icon={SquarePen} aria-label="Editar" data-demo-state="hover" />
            <IconButton
              icon={Trash}
              variant="danger"
              aria-label="Excluir"
              data-demo-state="hover"
            />
          </ShowcaseRow>
          <ShowcaseRow state="Disabled">
            <IconButton icon={SquarePen} aria-label="Editar" disabled />
            <IconButton icon={Trash} variant="danger" aria-label="Excluir" disabled />
          </ShowcaseRow>
        </Showcase>

        <Showcase title="Link">
          <ShowcaseRow state="Default">
            <Link href="#componentes">Link</Link>
          </ShowcaseRow>
          <ShowcaseRow state="Hover">
            <Link href="#componentes" data-demo-state="hover">
              Link
            </Link>
          </ShowcaseRow>
        </Showcase>

        <Showcase title="Pagination Button">
          <ShowcaseRow state="Default">
            <PaginationButton aria-label="Página anterior">
              <ChevronLeft aria-hidden="true" />
            </PaginationButton>
            <PaginationButton>1</PaginationButton>
          </ShowcaseRow>
          <ShowcaseRow state="Hover">
            <PaginationButton aria-label="Página anterior" data-demo-state="hover">
              <ChevronLeft aria-hidden="true" />
            </PaginationButton>
            <PaginationButton data-demo-state="hover">1</PaginationButton>
          </ShowcaseRow>
          <ShowcaseRow state="Active">
            <PaginationButton isActive>1</PaginationButton>
          </ShowcaseRow>
          <ShowcaseRow state="Disabled">
            <PaginationButton aria-label="Página anterior" disabled>
              <ChevronLeft aria-hidden="true" />
            </PaginationButton>
            <PaginationButton disabled>1</PaginationButton>
          </ShowcaseRow>
        </Showcase>

        <Showcase title="Tag">
          {tagColors.map(({ color, label }) => (
            <ShowcaseRow key={color} state={label}>
              <Tag color={color}>Tag</Tag>
            </ShowcaseRow>
          ))}
        </Showcase>

        <Showcase title="Type">
          <ShowcaseRow state="Income">
            <TransactionType type="income" />
          </ShowcaseRow>
          <ShowcaseRow state="Expense">
            <TransactionType type="expense" />
          </ShowcaseRow>
        </Showcase>
      </div>
    </Section>
  );
}

export function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12">
      <main className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <Logo title="Financy" />
          <Link asChild>
            <RouterLink to="/exemplo">Ver tela de exemplo</RouterLink>
          </Link>
        </header>
        <ColorsSection />
        <TypographySection />
        <IconsSection />
        <VectorsSection />
        <div id="componentes">
          <ComponentsSection />
        </div>
      </main>
    </div>
  );
}
