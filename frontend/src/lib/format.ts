const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Formata um valor em reais, ex.: 1234.5 -> "R$ 1.234,50". */
export function formatCurrency(value: number): string {
  // Intl usa espaço não separável entre "R$" e o número; trocamos por espaço comum.
  return currencyFormatter.format(value).replace(/ /g, " ");
}
