import { Eye, EyeClosed, type LucideIcon } from "lucide-react";
import { type ComponentProps, useId, useState } from "react";
import { Label } from "@/components/ui/label";
import type { DemoStateProps } from "@/lib/demo-state";
import { cn } from "@/lib/utils";

type InputProps = Omit<ComponentProps<"input">, "size"> &
  DemoStateProps<"focus"> & {
    label: string;
    icon?: LucideIcon;
    helperText?: string;
    /** Mensagem de erro: ativa o estado de erro e substitui o helperText. */
    error?: string;
    /** Classes do wrapper (label + campo + helper). */
    wrapperClassName?: string;
    /** Desativa o botão de mostrar/ocultar senha em campos `type="password"`. */
    hidePasswordToggle?: boolean;
  };

/** Cor do label conforme o estado; o wrapper precisa ter a classe `group`. */
export function fieldLabelClassName({ error, disabled }: { error?: boolean; disabled?: boolean }) {
  if (error) return "text-danger";
  if (disabled) return "text-gray-700";
  return "text-gray-700 group-focus-within:text-brand-base group-data-[demo-state=focus]:text-brand-base";
}

export function FieldMessage({
  id,
  error,
  helperText,
}: {
  id: string;
  error?: string;
  helperText?: string;
}) {
  const message = error ?? helperText;
  if (!message) return null;
  return (
    <p id={id} className={cn("text-xs", error ? "text-danger" : "text-gray-500")}>
      {message}
    </p>
  );
}

function Input({
  label,
  icon: Icon,
  helperText,
  error,
  disabled,
  id,
  className,
  wrapperClassName,
  placeholder,
  type,
  hidePasswordToggle,
  "data-demo-state": demoState,
  "aria-describedby": ariaDescribedBy,
  ...props
}: InputProps) {
  const generatedId = useId();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const hasMessage = Boolean(error ?? helperText);
  const hasError = Boolean(error);
  const hasPasswordToggle = type === "password" && !hidePasswordToggle;
  const resolvedType = hasPasswordToggle && passwordVisible ? "text" : type;

  const iconClassName = hasError
    ? "text-danger"
    : disabled
      ? "text-gray-400"
      : // Ícone vem depois do input no DOM para usar `peer-*`.
        "text-gray-800 peer-placeholder-shown:text-gray-400 peer-focus:text-brand-base peer-data-[demo-state=focus]:text-brand-base";

  return (
    <div
      className={cn("group flex w-full flex-col gap-2", wrapperClassName)}
      data-demo-state={demoState}
    >
      <Label htmlFor={inputId} className={fieldLabelClassName({ error: hasError, disabled })}>
        {label}
      </Label>
      <div className="relative">
        <input
          id={inputId}
          type={resolvedType}
          disabled={disabled}
          // Placeholder vazio garante que `:placeholder-shown` funcione mesmo sem texto de exemplo.
          placeholder={placeholder ?? " "}
          aria-invalid={hasError || undefined}
          aria-describedby={cn(hasMessage && messageId, ariaDescribedBy) || undefined}
          data-demo-state={demoState}
          className={cn(
            "peer h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-gray-800 text-sm caret-brand-base outline-none transition-colors placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400",
            Icon && "pl-9",
            hasPasswordToggle && "pr-9",
            className,
          )}
          {...props}
        />
        {Icon && (
          <Icon
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-colors",
              iconClassName,
            )}
          />
        )}
        {hasPasswordToggle && (
          <button
            type="button"
            onClick={() => setPasswordVisible((visible) => !visible)}
            disabled={disabled}
            aria-label={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={passwordVisible}
            aria-controls={inputId}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-sm text-gray-400 transition-colors hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:text-gray-400"
          >
            {passwordVisible ? (
              <Eye aria-hidden="true" className="size-4" />
            ) : (
              <EyeClosed aria-hidden="true" className="size-4" />
            )}
          </button>
        )}
      </div>
      <FieldMessage id={messageId} error={error} helperText={helperText} />
    </div>
  );
}

export { Input, type InputProps };
