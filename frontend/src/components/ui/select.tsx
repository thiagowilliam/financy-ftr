import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp, type LucideIcon } from "lucide-react";
import { type ComponentProps, type ReactNode, useId } from "react";
import { FieldMessage, fieldLabelClassName } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DemoStateProps } from "@/lib/demo-state";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

type SelectTriggerProps = ComponentProps<typeof SelectPrimitive.Trigger> &
  DemoStateProps<"focus" | "open"> & {
    icon?: LucideIcon;
  };

function SelectTrigger({ className, icon: Icon, children, ...props }: SelectTriggerProps) {
  const invalid = props["aria-invalid"] === true || props["aria-invalid"] === "true";

  return (
    <SelectPrimitive.Trigger
      className={cn(
        "group/trigger flex h-10 w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-left text-gray-800 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 data-[placeholder]:text-gray-400 [&>span]:line-clamp-1 [&>span]:flex-1",
        className,
      )}
      {...props}
    >
      {Icon && (
        <Icon
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 transition-colors",
            invalid
              ? "text-danger"
              : props.disabled
                ? "text-gray-400"
                : "text-gray-800 group-focus/trigger:text-brand-base group-data-[demo-state=focus]/trigger:text-brand-base group-data-[demo-state=open]/trigger:text-brand-base group-data-[placeholder]/trigger:text-gray-400 group-data-[state=open]/trigger:text-brand-base",
          )}
        />
      )}
      {children}
      <SelectPrimitive.Icon asChild>
        <span className="ml-auto shrink-0 text-gray-500 group-disabled/trigger:text-gray-400">
          <ChevronDown
            aria-hidden="true"
            className="size-4 group-data-[demo-state=open]/trigger:hidden group-data-[state=open]/trigger:hidden"
          />
          <ChevronUp
            aria-hidden="true"
            className="hidden size-4 group-data-[demo-state=open]/trigger:block group-data-[state=open]/trigger:block"
          />
        </span>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

const selectContentClassName =
  "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-lg border border-gray-200 bg-white p-1 text-gray-800 shadow-md";

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        className={cn(
          selectContentClassName,
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=open]:animate-in",
          position === "popper" &&
            "w-full min-w-[var(--radix-select-trigger-width)] data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="flex flex-col gap-0.5">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn("px-3 py-1.5 font-medium text-gray-500 text-xs", className)}
      {...props}
    />
  );
}

const selectItemClassName =
  "relative flex w-full cursor-default select-none items-center rounded-md py-2 pr-8 pl-3 text-gray-800 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-100 data-[disabled]:opacity-50";

function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item className={cn(selectItemClassName, className)} {...props}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-3 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check aria-hidden="true" className="size-4 text-success" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-gray-200", className)}
      {...props}
    />
  );
}

export type SelectOption = { value: string; label: ReactNode; disabled?: boolean };

type SelectFieldProps = Omit<ComponentProps<typeof SelectPrimitive.Root>, "children"> &
  DemoStateProps<"focus" | "open"> & {
    label: string;
    options: SelectOption[];
    placeholder?: string;
    icon?: LucideIcon;
    helperText?: string;
    error?: string;
    id?: string;
    className?: string;
  };

/** Select completo (label + trigger + helper/erro), com a mesma anatomia do Input. */
function SelectField({
  label,
  options,
  placeholder,
  icon,
  helperText,
  error,
  disabled,
  id,
  className,
  "data-demo-state": demoState,
  ...props
}: SelectFieldProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const messageId = `${triggerId}-message`;
  const hasError = Boolean(error);
  const labelState = demoState === "open" ? "focus" : demoState;

  return (
    <div
      className={cn(
        "group flex w-full flex-col gap-2",
        !hasError && !disabled && "has-[[data-state=open]]:[&>label]:text-brand-base",
        className,
      )}
      data-demo-state={labelState}
    >
      <Label htmlFor={triggerId} className={fieldLabelClassName({ error: hasError, disabled })}>
        {label}
      </Label>
      <Select disabled={disabled} {...props}>
        <SelectTrigger
          id={triggerId}
          icon={icon}
          data-demo-state={demoState}
          aria-invalid={hasError || undefined}
          aria-describedby={error || helperText ? messageId : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldMessage id={messageId} error={error} helperText={helperText} />
    </div>
  );
}

export {
  Select,
  SelectContent,
  SelectField,
  type SelectFieldProps,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  selectContentClassName,
  selectItemClassName,
};
