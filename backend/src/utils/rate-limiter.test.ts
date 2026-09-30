import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { TooManyRequestsError } from "../shared/errors/too-many-requests.error.js";
import { RateLimiter } from "./rate-limiter.js";

function createLimiter() {
  let now = 0;
  const limiter = new RateLimiter({ maxAttempts: 3, windowMs: 1_000, now: () => now });
  return { limiter, advance: (ms: number) => (now += ms) };
}

describe("RateLimiter", () => {
  it("bloqueia depois do limite de falhas", () => {
    const { limiter } = createLimiter();
    for (let i = 0; i < 3; i++) {
      limiter.assertAllowed("ip:ana");
      limiter.registerFailure("ip:ana");
    }
    assert.throws(() => limiter.assertAllowed("ip:ana"), TooManyRequestsError);
    // Outras chaves nao sao afetadas.
    assert.doesNotThrow(() => limiter.assertAllowed("ip:bia"));
  });

  it("libera quando a janela expira", () => {
    const { limiter, advance } = createLimiter();
    for (let i = 0; i < 3; i++) limiter.registerFailure("ip:ana");
    advance(1_000);
    assert.doesNotThrow(() => limiter.assertAllowed("ip:ana"));
  });

  it("zera as falhas com reset (login bem-sucedido)", () => {
    const { limiter } = createLimiter();
    for (let i = 0; i < 3; i++) limiter.registerFailure("ip:ana");
    limiter.reset("ip:ana");
    assert.doesNotThrow(() => limiter.assertAllowed("ip:ana"));
  });
});
