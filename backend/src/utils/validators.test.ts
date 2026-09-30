import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ValidationError } from "../shared/errors/validation.error.js";
import {
  assertEmail,
  assertHexColor,
  assertMinLength,
  assertPositiveInt,
  assertValidDate,
} from "./validators.js";

describe("validators", () => {
  it("normaliza e valida e-mail", () => {
    assert.equal(assertEmail("  Ana@Exemplo.com "), "ana@exemplo.com");
    assert.throws(() => assertEmail("ana@"), ValidationError);
  });

  it("exige tamanho minimo depois do trim", () => {
    assert.equal(assertMinLength(" Mercado ", 2, "name"), "Mercado");
    assert.throws(() => assertMinLength(" a ", 2, "name"), ValidationError);
    assert.throws(() => assertMinLength(undefined, 2, "name"), ValidationError);
  });

  it("aceita apenas inteiros positivos (centavos)", () => {
    assert.equal(assertPositiveInt(1500, "amount"), 1500);
    for (const invalid of [0, -1, 10.5, "10"]) {
      assert.throws(() => assertPositiveInt(invalid, "amount"), ValidationError);
    }
  });

  it("valida datas", () => {
    assert.ok(assertValidDate("2026-09-01T12:00:00.000Z", "date") instanceof Date);
    assert.throws(() => assertValidDate("nao-e-data", "date"), ValidationError);
  });

  it("normaliza cor hexadecimal para maiusculas", () => {
    assert.equal(assertHexColor("#22c55e"), "#22C55E");
    assert.throws(() => assertHexColor("verde"), ValidationError);
  });
});
