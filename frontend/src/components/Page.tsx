import { cn } from "@/lib/utils";

interface PageProps {
  children: React.ReactNode;
  className?: string;
}

export function Page({ children, className }: PageProps) {
  return (
    <div className={cn("min-h-[calc(100vh-9rem)] rounded-xl bg-white p-12", className)}>
      {children}
    </div>
  );
}
