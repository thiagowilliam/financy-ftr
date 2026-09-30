import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GraphQLRequestError, getErrorMessage } from "./errors.ts";

describe("getErrorMessage", () => {
  it("usa a mensagem enviada pela API", () => {
    const error = new GraphQLRequestError("Credenciais invalidas.", "UNAUTHENTICATED");
    assert.equal(getErrorMessage(error), "Credenciais invalidas.");
  });

  it("não expõe erros inesperados e usa o fallback", () => {
    assert.equal(getErrorMessage(new Error("stack interna"), "Falhou"), "Falhou");
  });
});
