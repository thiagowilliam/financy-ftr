import { apolloClient } from "@/lib/apollo"
import { LOGIN } from "@/lib/graphql/mutations/Login"
import { REGISTER } from "@/lib/graphql/mutations/Register"
import type { LoginInput, RegisterInput, User } from "@/types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type RegisterMutationData = {
  signUp: {
    token: string
    user: User
  }
}

type LoginMutationData = {
  signIn: {
    token: string
    user: User
  }
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  signup: (data: RegisterInput) => Promise<boolean>
  login: (data: LoginInput) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>() (
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        login: async (loginData: LoginInput) => {
          try{
              const {data} = await apolloClient.mutate<LoginMutationData, { data: LoginInput }>({
                mutation: LOGIN,
                variables: {
                  data: {
                    email: loginData.email,
                    password: loginData.password
                  }
                }
              })

              if(data?.signIn){
                const { user, token } = data.signIn
                set({
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                  },
                  token,
                  isAuthenticated: true
                })
                return true
              }
              return false
          }catch(error){
            console.log("Erro ao fazer o login")
            throw error
          }
        },
        signup: async (registerData: RegisterInput) => {
          try{
              const { data } = await apolloClient.mutate<
              RegisterMutationData,
                {data: RegisterInput}
              >({
                mutation: REGISTER,
                variables: {
                  data: {
                      name: registerData.name,
                      email: registerData.email,
                      password: registerData.password
                  }
                }
              })
              if(data?.signUp){
                const { token, user } = data.signUp
                set({
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                  },
                  token,
                  isAuthenticated: true
                })
                return true
              }
              return false
          }catch(error){
            console.log("Erro ao fazer o cadastro")
            throw error
          }
        },
        logout: () => {
          set({
            user:null,
            token: null,
            isAuthenticated: false
          })
          apolloClient.clearStore()
        },
      }),
      {
        name: 'auth-storage'
      }
    )
)