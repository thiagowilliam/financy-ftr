import { TooManyRequestsError } from "../shared/errors/too-many-requests.error.js";

interface Attempts {
  count: number;
  resetAt: number;
}

interface RateLimiterOptions {
  maxAttempts: number;
  windowMs: number;
  /** Relogio injetavel, usado nos testes. */
  now?: () => number;
}

/** Acima deste numero de chaves, as expiradas sao removidas para nao crescer sem limite. */
const SWEEP_THRESHOLD = 10_000;

/**
 * Limita falhas por chave dentro de uma janela de tempo, em memoria.
 * Suficiente para uma instancia unica; com varias instancias o ideal e um store compartilhado.
 */
export class RateLimiter {
  private readonly attempts = new Map<string, Attempts>();
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  private readonly now: () => number;

  constructor({ maxAttempts, windowMs, now = Date.now }: RateLimiterOptions) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.now = now;
  }

  /** Lanca TOO_MANY_REQUESTS quando a chave ja estourou o limite na janela atual. */
  assertAllowed(key: string): void {
    const entry = this.current(key);
    if (entry && entry.count >= this.maxAttempts) {
      const minutes = Math.ceil((entry.resetAt - this.now()) / 60_000);
      throw new TooManyRequestsError(
        `Muitas tentativas de login. Tente novamente em ${minutes} minuto(s).`,
      );
    }
  }

  registerFailure(key: string): void {
    const entry = this.current(key);
    if (entry) {
      entry.count += 1;
      return;
    }
    if (this.attempts.size >= SWEEP_THRESHOLD) {
      this.sweep();
    }
    this.attempts.set(key, { count: 1, resetAt: this.now() + this.windowMs });
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }

  private current(key: string): Attempts | undefined {
    const entry = this.attempts.get(key);
    if (entry && entry.resetAt <= this.now()) {
      this.attempts.delete(key);
      return undefined;
    }
    return entry;
  }

  private sweep(): void {
    const now = this.now();
    for (const [key, entry] of this.attempts) {
      if (entry.resetAt <= now) {
        this.attempts.delete(key);
      }
    }
  }
}
