import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import type { ComponentProps } from "react";
import type { TransactionKind } from "@/components/ui/transaction-type";
import { cn } from "@/lib/utils";

const options = [
  {
    value: "expense",
    label: "Despesa",
    icon: CircleArrowDown,
    activeClassName: "border-red-base",
    activeIconClassName: "text-red-base",
  },
  {
    value: "income",
    label: "Receita",
    icon: CircleArrowUp,
    activeClassName: "border-green-base",
    activeIconClassName: "text-green-base",
  },
] as const;

type TransactionTypeToggleProps = Omit<ComponentProps<"fieldset">, "onChange"> & {
  value: TransactionKind;
  onValueChange: (value: TransactionKind) => void;
  /** Nome do grupo de rádios. */
  name?: string;
};

/** Seletor segmentado entre despesa e receita (grupo de rádios nativos). */
function TransactionTypeToggle({
  value,
  onValueChange,
  name = "transaction-type",
  className,
  ...props
}: TransactionTypeToggleProps) {
  return (
    <fieldset
      className={cn("grid grid-cols-2 gap-2 rounded-xl border border-gray-200 p-2", className)}
      {...props}
    >
      <legend className="sr-only">Tipo da transação</legend>
      {options.map((option) => {
        const isActive = value === option.value;
        const Icon = option.icon;
        return (
          <label
            key={option.value}
            className={cn(
              "inline-flex h-10 cursor-pointer items-center justify-center gap-3 rounded-lg border border-transparent text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2",
              isActive
                ? cn("bg-white font-medium text-gray-800", option.activeClassName)
                : "text-gray-600 hover:text-gray-800",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isActive}
              onChange={() => onValueChange(option.value)}
              className="sr-only"
            />
            <Icon
              aria-hidden="true"
              className={cn("size-4", isActive ? option.activeIconClassName : "text-gray-400")}
            />
            {option.label}
          </label>
        );
      })}
    </fieldset>
  );
}

export { TransactionTypeToggle, type TransactionTypeToggleProps };
