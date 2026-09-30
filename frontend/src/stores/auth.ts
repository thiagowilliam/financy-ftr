import { create } from "zustand";
import { persist } from "zustand/middleware";
import { graphqlRequest } from "@/lib/graphql/client";
import { LOGIN } from "@/lib/graphql/mutations/Login";
import { REGISTER } from "@/lib/graphql/mutations/Register";
import { queryClient } from "@/lib/query-client";
import type { LoginInput, RegisterInput, User } from "@/types";

type AuthPayload = {
  token: string;
  user: User;
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  signup: (data: RegisterInput) => Promise<boolean>;
  login: (data: LoginInput) => Promise<boolean>;
  logout: () => void;
  /** Atualiza os dados do usuário logado (ex.: após editar o perfil). */
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      /** Guarda a sessão devolvida por signIn/signUp. Erros sobem para a tela tratar. */
      const startSession = ({ token, user }: AuthPayload) => {
        set({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          token,
          isAuthenticated: true,
        });
        return true;
      };

      return {
        user: null,
        token: null,
        isAuthenticated: false,
        login: async ({ email, password }: LoginInput) => {
          const data = await graphqlRequest<{ signIn: AuthPayload }, { data: LoginInput }>(LOGIN, {
            data: { email, password },
          });
          return startSession(data.signIn);
        },
        signup: async ({ name, email, password }: RegisterInput) => {
          const data = await graphqlRequest<{ signUp: AuthPayload }, { data: RegisterInput }>(
            REGISTER,
            { data: { name, email, password } },
          );
          return startSession(data.signUp);
        },
        setUser: (user: User) => {
          set({ user });
        },
        logout: () => {
          set({ user: null, token: null, isAuthenticated: false });
          queryClient.clear();
        },
      };
    },
    { name: "auth-storage" },
  ),
);
