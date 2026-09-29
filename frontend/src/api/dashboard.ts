import { queryOptions } from "@tanstack/react-query";
import { graphqlRequest } from "@/lib/graphql/client";
import { DASHBOARD_SUMMARY } from "@/lib/graphql/queries/Dashboard";
import type { DashboardSummary } from "@/types";

type DashboardSummaryInput = {
  startDate: string;
  endDate: string;
  categoriesLimit?: number;
};

/** Fábrica de query keys do dashboard. */
export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: (input: DashboardSummaryInput) => [...dashboardKeys.all, "summary", input] as const,
};

export const dashboardSummaryQueryOptions = (input: DashboardSummaryInput) =>
  queryOptions({
    queryKey: dashboardKeys.summary(input),
    queryFn: async ({ signal }) => {
      const data = await graphqlRequest<
        { dashboardSummary: DashboardSummary },
        { input: DashboardSummaryInput }
      >(DASHBOARD_SUMMARY, { input }, signal);
      return data.dashboardSummary;
    },
  });
