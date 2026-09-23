import { gql } from "@apollo/client"

export const LOGIN = gql`
  mutation SignIn($data: SignInInput!) {
    signIn(data: $data) {
      token
      user {
        id
        name
        email
        createdAt
        updatedAt
      }
    }
  }
`
