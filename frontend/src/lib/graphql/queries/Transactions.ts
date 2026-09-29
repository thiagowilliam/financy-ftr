const TRANSACTION_FIELDS = /* GraphQL */ `
  fragment TransactionFields on Transaction {
    id
    description
    amount
    type
    date
    category {
      id
      name
      icon
      color
    }
  }
`;

export const TRANSACTIONS_PAGE = /* GraphQL */ `
  query TransactionsPage($filters: ListTransactionsInput, $pagination: PaginationInput) {
    transactionsPage(filters: $filters, pagination: $pagination) {
      items {
        ...TransactionFields
      }
      total
      page
      perPage
      totalPages
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const CREATE_TRANSACTION = /* GraphQL */ `
  mutation CreateTransaction($data: CreateTransactionInput!) {
    createTransaction(data: $data) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const UPDATE_TRANSACTION = /* GraphQL */ `
  mutation UpdateTransaction($id: ID!, $data: UpdateTransactionInput!) {
    updateTransaction(id: $id, data: $data) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const DELETE_TRANSACTION = /* GraphQL */ `
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;
