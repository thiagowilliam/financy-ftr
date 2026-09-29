const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/**
 * Formata um valor em reais, ex.: 1234.5 -> "R$ 1.234,50" e -80 -> "- R$ 80,00"
 * (mesmo padrão de sinal usado nas listas de transações).
 */
export function formatCurrency(value: number): string {
  // Intl usa espaço não separável entre "R$" e o número; trocamos por espaço comum.
  const formatted = currencyFormatter.format(Math.abs(value)).replace(/ /g, " ");
  return value < 0 ? `- ${formatted}` : formatted;
}

/** Quantidade de itens com plural, ex.: 1 -> "1 item", 3 -> "3 itens". */
export function formatItemCount(count: number): string {
  return `${count} ${count === 1 ? "item" : "itens"}`;
}

/** Iniciais do nome (até duas letras), ex.: "Conta teste" -> "CT". */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

// As datas das transações são salvas ao meio-dia UTC, então formatamos em UTC
// para o dia exibido não mudar conforme o fuso do navegador.
const shortDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  timeZone: "UTC",
});

/** Data curta, ex.: "2026-09-29T12:00:00.000Z" -> "29/09/26". */
export function formatShortDate(isoDate: string): string {
  return shortDateFormatter.format(new Date(isoDate));
}

/** "2026-09-29T12:00:00.000Z" -> "2026-09-29" (valor de um input type="date"). */
export function toDateInputValue(isoDate: string): string {
  return isoDate.slice(0, 10);
}

/** "2026-09-29" -> "2026-09-29T12:00:00.000Z" (meio-dia UTC evita troca de dia por fuso). */
export function fromDateInputValue(value: string): string {
  return `${value}T12:00:00.000Z`;
}

/** Centavos -> texto do campo de valor, ex.: 8950 -> "89,50". */
export function centsToInputValue(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Texto digitado -> centavos, aceitando "1.234,56", "1234,5" ou "1234.56".
 * Retorna null se não for um número válido.
 */
export function parseCurrencyToCents(value: string): number | null {
  const cleaned = value.replace(/[^\d.,]/g, "");
  if (!cleaned) return null;
  const lastSeparator = Math.max(cleaned.lastIndexOf(","), cleaned.lastIndexOf("."));
  const hasDecimals = lastSeparator !== -1 && cleaned.length - lastSeparator - 1 <= 2;
  const integerPart = hasDecimals ? cleaned.slice(0, lastSeparator) : cleaned;
  const decimalPart = hasDecimals ? cleaned.slice(lastSeparator + 1) : "";
  const normalized = `${integerPart.replace(/[.,]/g, "")}.${decimalPart.padEnd(2, "0")}`;
  const number = Number(normalized);
  return Number.isFinite(number) ? Math.round(number * 100) : null;
}
