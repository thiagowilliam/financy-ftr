import { cva } from "class-variance-authority";
import type { ComponentProps } from "react";
import type { DemoStateProps } from "@/lib/demo-state";
import { cn } from "@/lib/utils";

const paginationButtonVariants = cva(
  "inline-flex size-8 shrink-0 items-center justify-center rounded-lg border font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4",
  {
    variants: {
      active: {
        true: "border-brand-base bg-brand-base text-white",
        false:
          "border-gray-300 bg-white text-gray-800 hover:bg-gray-200 disabled:border-gray-200 disabled:bg-white disabled:text-gray-400 data-[demo-state=hover]:bg-gray-200",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

type PaginationButtonProps = ComponentProps<"button"> &
  DemoStateProps<"hover"> & {
    /** Página atual: aplica o estado ativo e aria-current="page". */
    isActive?: boolean;
  };

function PaginationButton({
  className,
  isActive = false,
  type = "button",
  ...props
}: PaginationButtonProps) {
  return (
    <button
      type={type}
      aria-current={isActive ? "page" : undefined}
      className={cn(paginationButtonVariants({ active: isActive, className }))}
      {...props}
    />
  );
}

export { PaginationButton, type PaginationButtonProps, paginationButtonVariants };
