import { ChevronRight } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@/components/ui/link";

type DashboardCardHeaderProps = {
  title: string;
  linkLabel: string;
  to: string;
};

export function DashboardCardHeader({ title, linkLabel, to }: DashboardCardHeaderProps) {
  return (
    <div className="flex items-center justify-between border-gray-200 border-b px-6 py-5">
      <h2 className="font-medium text-gray-500 text-xs uppercase tracking-wide">{title}</h2>
      <Link asChild className="inline-flex items-center gap-1">
        <RouterLink to={to}>
          {linkLabel}
          <ChevronRight aria-hidden="true" className="size-5" />
        </RouterLink>
      </Link>
    </div>
  );
}
