import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatCurrency,
  formatItemCount,
  fromDateInputValue,
  getInitials,
  parseCurrencyToCents,
} from "./format.ts";

describe("parseCurrencyToCents", () => {
  it("aceita os formatos brasileiro e americano", () => {
    assert.equal(parseCurrencyToCents("1.234,56"), 123456);
    assert.equal(parseCurrencyToCents("1234.56"), 123456);
    assert.equal(parseCurrencyToCents("1234,5"), 123450);
    assert.equal(parseCurrencyToCents("R$ 89,90"), 8990);
  });

  it("trata separador de milhar sem decimais", () => {
    assert.equal(parseCurrencyToCents("1.234"), 123400);
  });

  it("retorna null para texto sem número", () => {
    assert.equal(parseCurrencyToCents(""), null);
    assert.equal(parseCurrencyToCents("abc"), null);
  });
});

describe("formatadores", () => {
  it("formata moeda com sinal para valores negativos", () => {
    assert.equal(formatCurrency(1234.5), "R$ 1.234,50");
    assert.equal(formatCurrency(-80), "- R$ 80,00");
  });

  it("pluraliza a contagem de itens", () => {
    assert.equal(formatItemCount(1), "1 item");
    assert.equal(formatItemCount(3), "3 itens");
  });

  it("gera até duas iniciais", () => {
    assert.equal(getInitials("  conta de teste "), "CD");
  });

  it("converte a data do input para meio-dia UTC", () => {
    assert.equal(fromDateInputValue("2026-09-29"), "2026-09-29T12:00:00.000Z");
  });
});
