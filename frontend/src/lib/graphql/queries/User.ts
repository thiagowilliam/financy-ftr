const USER_FIELDS = /* GraphQL */ `
  fragment UserFields on User {
    id
    name
    email
    createdAt
    updatedAt
  }
`;

export const ME = /* GraphQL */ `
  query Me {
    me {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

export const UPDATE_PROFILE = /* GraphQL */ `
  mutation UpdateProfile($data: UpdateProfileInput!) {
    updateProfile(data: $data) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;
