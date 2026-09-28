import { cn } from "@/lib/utils";
import type { PaletteColor } from "@/styles/tokens";
import { categoryColorOptions } from "./category-options";

// Classes completas (sem interpolação) para o JIT do Tailwind v3 detectá-las.
const swatchClassName: Record<PaletteColor, string> = {
  green: "bg-green-base",
  blue: "bg-blue-base",
  purple: "bg-purple-base",
  pink: "bg-pink-base",
  red: "bg-red-base",
  orange: "bg-orange-base",
  yellow: "bg-yellow-base",
};

type CategoryColorPickerProps = {
  value: PaletteColor;
  onValueChange: (value: PaletteColor) => void;
  name?: string;
};

/** Paleta de cores selecionáveis (grupo de rádios nativos). */
export function CategoryColorPicker({
  value,
  onValueChange,
  name = "category-color",
}: CategoryColorPickerProps) {
  return (
    <fieldset>
      <legend className="mb-2 font-medium text-gray-700 text-sm leading-none">Cor</legend>
      <div className="grid grid-cols-7 gap-2">
        {categoryColorOptions.map(({ value: optionValue, label }) => {
          const isActive = value === optionValue;
          return (
            <label
              key={optionValue}
              title={label}
              className={cn(
                "flex h-7 cursor-pointer rounded-lg border p-1 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2",
                isActive ? "border-brand-base bg-gray-100" : "border-gray-300 hover:bg-gray-100",
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
              <span
                aria-hidden="true"
                className={cn("flex-1 rounded", swatchClassName[optionValue])}
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
