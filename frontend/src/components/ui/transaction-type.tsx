import { cva } from "class-variance-authority";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type TransactionKind = "income" | "expense";

const transactionTypeVariants = cva("inline-flex items-center gap-2 font-medium text-sm", {
  variants: {
    type: {
      income: "text-green-dark",
      expense: "text-red-dark",
    },
  },
});

const config = {
  income: { label: "Entrada", icon: CircleArrowUp },
  expense: { label: "Saída", icon: CircleArrowDown },
} as const;

type TransactionTypeProps = Omit<ComponentProps<"span">, "children"> & {
  type: TransactionKind;
};

function TransactionType({ type, className, ...props }: TransactionTypeProps) {
  const { label, icon: Icon } = config[type];
  return (
    <span className={cn(transactionTypeVariants({ type, className }))} {...props}>
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      {label}
    </span>
  );
}

export { TransactionType, type TransactionTypeProps, transactionTypeVariants };
