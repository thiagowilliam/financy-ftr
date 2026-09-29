import { Arg, Authorized, Ctx, Query, Resolver } from "type-graphql";
import type { Context } from "../../graphql/context.js";
import { requireUserId } from "../../utils/require-user-id.js";
import { DashboardSummary } from "./dashboard.model.js";
import { dashboardService } from "./dashboard.service.js";
import { DashboardSummaryInput } from "./dtos/dashboard-summary.input.js";

@Authorized()
@Resolver(() => DashboardSummary)
export class DashboardResolver {
  @Query(() => DashboardSummary, {
    description: "Saldo total, receitas e despesas do periodo e categorias com mais gastos.",
  })
  async dashboardSummary(
    @Ctx() ctx: Context,
    @Arg("input", () => DashboardSummaryInput, { nullable: true })
    input?: DashboardSummaryInput | null,
  ): Promise<DashboardSummary> {
    return dashboardService.summary(requireUserId(ctx), input);
  }
}
