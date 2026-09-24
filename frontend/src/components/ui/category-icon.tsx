import { cva } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import type { PaletteColor } from "@/styles/tokens";

// Classes completas (sem interpolação) para o JIT do Tailwind v3 detectá-las.
const categoryIconVariants = cva(
  "inline-flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4",
  {
    variants: {
      color: {
        blue: "bg-blue-light text-blue-base",
        purple: "bg-purple-light text-purple-base",
        pink: "bg-pink-light text-pink-base",
        red: "bg-red-light text-red-base",
        orange: "bg-orange-light text-orange-base",
        yellow: "bg-yellow-light text-yellow-base",
        green: "bg-green-light text-green-base",
      },
    },
    defaultVariants: {
      color: "green",
    },
  },
);

type CategoryIconProps = Omit<ComponentProps<"span">, "color" | "children"> & {
  icon: LucideIcon;
  color?: PaletteColor;
};

function CategoryIcon({ icon: Icon, color, className, ...props }: CategoryIconProps) {
  return (
    <span className={cn(categoryIconVariants({ color, className }))} {...props}>
      <Icon aria-hidden="true" />
    </span>
  );
}

export { CategoryIcon, type CategoryIconProps, categoryIconVariants };
