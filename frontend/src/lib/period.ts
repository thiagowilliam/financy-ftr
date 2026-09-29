import type { SelectOption } from "@/components/ui/select";

const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "long", timeZone: "UTC" });

/** Valor "YYYY-MM" do mês atual. */
export function currentPeriod(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** Últimos `count` meses como opções do select, ex.: { value: "2026-09", label: "Setembro / 2026" }. */
export function lastMonthsOptions(count = 12, from = new Date()): SelectOption[] {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(from.getFullYear(), from.getMonth() - index, 1));
    const month = monthFormatter.format(date);
    return {
      value: `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`,
      label: `${month.charAt(0).toUpperCase()}${month.slice(1)} / ${date.getUTCFullYear()}`,
    };
  });
}

/** "2026-09" -> intervalo ISO do mês inteiro (em UTC, como as datas salvas). */
export function periodToRange(period: string): { startDate: string; endDate: string } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(period);
  if (!match) return null;
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  return {
    startDate: new Date(Date.UTC(year, monthIndex, 1)).toISOString(),
    endDate: new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999)).toISOString(),
  };
}
