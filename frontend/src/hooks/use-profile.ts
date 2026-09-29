import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { meQueryOptions, updateProfile, userKeys } from "@/api/user";
import { useAuthStore } from "@/stores/auth";

/**
 * Busca o usuário logado no servidor e sincroniza a store de autenticação,
 * que alimenta o cabeçalho (iniciais do avatar) e é persistida no navegador.
 */
export function useMe() {
  const setUser = useAuthStore((state) => state.setUser);
  const query = useQuery(meQueryOptions());

  useEffect(() => {
    if (query.data) setUser(query.data);
  }, [query.data, setUser]);

  return query;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(userKeys.me(), user);
      setUser(user);
    },
  });
}
