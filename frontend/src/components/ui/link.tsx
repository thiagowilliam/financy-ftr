import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";
import type { DemoStateProps } from "@/lib/demo-state";
import { cn } from "@/lib/utils";

type LinkProps = ComponentProps<"a"> &
  DemoStateProps<"hover"> & {
    /** Renderiza o filho (ex.: Link do react-router) com os estilos. */
    asChild?: boolean;
  };

const linkClassName =
  "rounded-sm font-medium text-brand-base text-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[demo-state=hover]:underline";

function Link({ className, asChild = false, ...props }: LinkProps) {
  const Comp = asChild ? Slot : "a";
  return <Comp className={cn(linkClassName, className)} {...props} />;
}

export { Link, type LinkProps, linkClassName };
