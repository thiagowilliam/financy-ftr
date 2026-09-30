import assert from "node:assert/strict";
import { before, describe, it } from "node:test";

// env.ts exige estas variaveis no import; os valores de teste vem antes do import dinamico.
process.env.JWT_SECRET = "segredo-de-teste";
process.env.DATABASE_URL ??= "file:./test.db";

let jwt: typeof import("./jwt.js");

before(async () => {
  jwt = await import("./jwt.js");
});

describe("jwt", () => {
  it("assina e recupera o id do usuario", () => {
    const token = jwt.signToken("user-123");
    assert.equal(jwt.verifyToken(token), "user-123");
  });

  it("retorna null para token invalido ou adulterado", () => {
    const token = jwt.signToken("user-123");
    assert.equal(jwt.verifyToken("nao-e-um-token"), null);
    assert.equal(jwt.verifyToken(`${token}x`), null);
  });
});
