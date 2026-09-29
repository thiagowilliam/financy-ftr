export const DASHBOARD_SUMMARY = /* GraphQL */ `
  query DashboardSummary($input: DashboardSummaryInput) {
    dashboardSummary(input: $input) {
      balance
      periodIncome
      periodExpense
      topExpenseCategories {
        category {
          id
          name
          icon
          color
        }
        transactionCount
        total
      }
    }
  }
`;
