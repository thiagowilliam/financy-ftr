import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type SummaryCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClassName?: string;
};

export function SummaryCard({ label, value, icon: Icon, iconClassName }: SummaryCardProps) {
  return (
    <Card className="border-gray-200 p-6 shadow-none">
      <div className="flex items-center gap-3">
        <Icon aria-hidden="true" className={cn("size-5", iconClassName)} />
        <span className="font-medium text-gray-500 text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-4 font-bold text-[1.75rem] text-gray-800 leading-8">
        {formatCurrency(value)}
      </p>
    </Card>
  );
}
