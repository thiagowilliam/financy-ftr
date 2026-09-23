import type { AuthChecker } from "type-graphql";
import type { Context } from "./context.js";

export const authChecker: AuthChecker<Context> = ({ context }) => context.userId !== null;
