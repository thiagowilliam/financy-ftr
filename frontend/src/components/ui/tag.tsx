import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Classes completas (sem interpolação) para o JIT do Tailwind v3 detectá-las.
const tagVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 font-medium text-sm",
  {
    variants: {
      color: {
        gray: "bg-gray-200 text-gray-700",
        blue: "bg-blue-light text-blue-dark",
        purple: "bg-purple-light text-purple-dark",
        pink: "bg-pink-light text-pink-dark",
        red: "bg-red-light text-red-dark",
        orange: "bg-orange-light text-orange-dark",
        yellow: "bg-yellow-light text-yellow-dark",
        green: "bg-green-light text-green-dark",
      },
    },
    defaultVariants: {
      color: "gray",
    },
  },
);

type TagColor = NonNullable<VariantProps<typeof tagVariants>["color"]>;

type TagProps = Omit<ComponentProps<"span">, "color"> & VariantProps<typeof tagVariants>;

function Tag({ className, color, ...props }: TagProps) {
  return <span className={cn(tagVariants({ color, className }))} {...props} />;
}

export { Tag, type TagColor, type TagProps, tagVariants };
