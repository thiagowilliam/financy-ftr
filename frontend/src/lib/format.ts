const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Formata um valor em reais, ex.: 1234.5 -> "R$ 1.234,50". */
export function formatCurrency(value: number): string {
  // Intl usa espaço não separável entre "R$" e o número; trocamos por espaço comum.
  return currencyFormatter.format(value).replace(/ /g, " ");
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
