import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
import type { DemoStateProps } from "@/lib/demo-state";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  "inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-white data-[demo-state=hover]:bg-gray-200 [&_svg]:pointer-events-none [&_svg]:size-4 disabled:[&_svg]:opacity-50",
  {
    variants: {
      variant: {
        default: "text-gray-700",
        danger: "text-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type IconButtonProps = Omit<ComponentProps<"button">, "children" | "aria-label"> &
  VariantProps<typeof iconButtonVariants> &
  DemoStateProps<"hover"> & {
    icon: LucideIcon;
    /** Obrigatório: o botão não possui texto visível. */
    "aria-label": string;
  };

function IconButton({
  className,
  variant,
  icon: Icon,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button type={type} className={cn(iconButtonVariants({ variant, className }))} {...props}>
      <Icon aria-hidden="true" />
    </button>
  );
}

export { IconButton, type IconButtonProps, iconButtonVariants };
