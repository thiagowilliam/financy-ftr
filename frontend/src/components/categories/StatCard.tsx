import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName?: string;
};

export function StatCard({ label, value, icon: Icon, iconClassName }: StatCardProps) {
  return (
    <Card className="flex items-start gap-4 border-gray-200 p-6 shadow-none">
      <Icon aria-hidden="true" className={cn("mt-1.5 size-6 shrink-0", iconClassName)} />
      <div className="flex min-w-0 flex-col gap-2">
        <p className="truncate font-bold text-[1.75rem] text-gray-800 leading-8">{value}</p>
        <span className="font-medium text-gray-500 text-xs uppercase tracking-wide">{label}</span>
      </div>
    </Card>
  );
}
