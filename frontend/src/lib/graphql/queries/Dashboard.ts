export const DASHBOARD_SUMMARY = /* GraphQL */ `
  query DashboardSummary($input: DashboardSummaryInput) {
    dashboardSummary(input: $input) {
      balance
      periodIncome
      periodExpense
      topCategories {
        category {
          id
          name
          icon
          color
        }
        transactionCount
        income
        expense
        total
      }
    }
  }
`;
