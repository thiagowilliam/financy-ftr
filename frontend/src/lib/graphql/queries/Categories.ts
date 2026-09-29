const CATEGORY_FIELDS = /* GraphQL */ `
  fragment CategoryFields on Category {
    id
    name
    description
    type
    icon
    color
    transactionCount
  }
`;

export const CATEGORIES = /* GraphQL */ `
  query Categories {
    categories {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`;

export const CREATE_CATEGORY = /* GraphQL */ `
  mutation CreateCategory($data: CreateCategoryInput!) {
    createCategory(data: $data) {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`;

export const UPDATE_CATEGORY = /* GraphQL */ `
  mutation UpdateCategory($id: ID!, $data: UpdateCategoryInput!) {
    updateCategory(id: $id, data: $data) {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`;

export const DELETE_CATEGORY = /* GraphQL */ `
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;
