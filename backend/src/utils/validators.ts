import { ValidationError } from "../shared/errors/validation.error.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function assertRequiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ValidationError(`O campo "${field}" e obrigatorio.`, field);
  }
  return value.trim();
}

export function assertMinLength(value: unknown, min: number, field: string): string {
  const parsed = assertRequiredString(value, field);
  if (parsed.length < min) {
    throw new ValidationError(
      `O campo "${field}" deve ter no minimo ${min} caracteres.`,
      field,
    );
  }
  return parsed;
}

export function assertEmail(value: unknown, field = "email"): string {
  const parsed = assertRequiredString(value, field).toLowerCase();
  if (!EMAIL_PATTERN.test(parsed)) {
    throw new ValidationError(`O campo "${field}" deve conter um e-mail valido.`, field);
  }
  return parsed;
}

export function assertPositiveInt(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new ValidationError(
      `O campo "${field}" deve ser um numero inteiro maior que zero.`,
      field,
    );
  }
  return value;
}

export function assertValidDate(value: unknown, field: string): Date {
  const parsed = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(parsed.getTime())) {
    throw new ValidationError(`O campo "${field}" deve conter uma data valida.`, field);
  }
  return parsed;
}

export function assertEnumValue(allowed: readonly string[], value: unknown, field: string): string {
  if (typeof value !== "string" || !allowed.includes(value)) {
    throw new ValidationError(
      `O campo "${field}" deve ser um destes valores: ${allowed.join(", ")}.`,
      field,
    );
  }
  return value;
}

export function assertHexColor(value: unknown, field = "color"): string {
  const parsed = assertRequiredString(value, field);
  if (!HEX_COLOR_PATTERN.test(parsed)) {
    throw new ValidationError(
      `O campo "${field}" deve estar no formato hexadecimal, por exemplo #22C55E.`,
      field,
    );
  }
  return parsed.toUpperCase();
}
