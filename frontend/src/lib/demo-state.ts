/**
 * Estados estáticos para exibição no style guide.
 * USO EXCLUSIVO DO STYLE GUIDE: no uso normal, hover/focus vêm das pseudo-classes reais.
 */
export type DemoState = "hover" | "focus";

export type DemoStateProps<S extends string = DemoState> = {
  "data-demo-state"?: S;
};
