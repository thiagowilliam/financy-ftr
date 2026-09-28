import { cn } from "@/lib/utils";
import { categoryIconOptions } from "./category-options";

type CategoryIconPickerProps = {
  value: string;
  onValueChange: (value: string) => void;
  name?: string;
};

/** Grade de ícones selecionáveis (grupo de rádios nativos). */
export function CategoryIconPicker({
  value,
  onValueChange,
  name = "category-icon",
}: CategoryIconPickerProps) {
  return (
    <fieldset>
      <legend className="mb-2 font-medium text-gray-700 text-sm leading-none">Ícone</legend>
      <div className="grid grid-cols-8 gap-2">
        {categoryIconOptions.map(({ value: optionValue, label, icon: Icon }) => {
          const isActive = value === optionValue;
          return (
            <label
              key={optionValue}
              title={label}
              className={cn(
                "inline-flex aspect-square cursor-pointer items-center justify-center rounded-lg border transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 [&_svg]:size-5",
                isActive
                  ? "border-brand-base bg-gray-100 text-gray-800"
                  : "border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-800",
              )}
            >
              <input
                type="radio"
                name={name}
                value={optionValue}
                checked={isActive}
                onChange={() => onValueChange(optionValue)}
                aria-label={label}
                className="sr-only"
              />
              <Icon aria-hidden="true" />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
