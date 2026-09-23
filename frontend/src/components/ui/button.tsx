import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
import type { DemoStateProps } from "@/lib/demo-state";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-base text-white hover:bg-brand-dark disabled:bg-brand-base disabled:opacity-50 data-[demo-state=hover]:bg-brand-dark",
        secondary:
          "border border-gray-300 bg-white text-gray-800 hover:bg-gray-200 disabled:border-gray-200 disabled:bg-white disabled:text-gray-400 data-[demo-state=hover]:bg-gray-200",
      },
      size: {
        md: "h-12 px-4 text-base [&_svg]:size-5",
        sm: "h-9 px-3 text-sm [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> &
  DemoStateProps<"hover"> & {
    asChild?: boolean;
    /** Ícone exibido à esquerda do texto. */
    icon?: LucideIcon;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  icon: Icon,
  children,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      type={asChild ? type : (type ?? "button")}
      {...props}
    >
      {Icon && <Icon aria-hidden="true" />}
      <Slottable>{children}</Slottable>
    </Comp>
  );
}

export { Button, type ButtonProps, buttonVariants };
