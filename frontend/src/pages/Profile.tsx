import { LogOut, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useMe, useUpdateProfile } from "@/hooks/use-profile";
import { getInitials } from "@/lib/format";
import { getErrorMessage } from "@/lib/graphql/client";
import { useAuthStore } from "@/stores/auth";
import type { User } from "@/types";

const NAME_MIN_LENGTH = 2;

export function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  // Revalida os dados no servidor; a store já tem os dados salvos no login.
  useMe();
  // A mutation fica aqui (e não no formulário) porque o formulário é remontado
  // ao salvar, e o React Query descarta os callbacks de um componente desmontado.
  const updateMutation = useUpdateProfile();

  const handleSave = (name: string) => {
    updateMutation.mutate(
      { name },
      {
        onSuccess: () => {
          toast.success("Perfil atualizado", {
            description: "Suas alterações foram salvas com sucesso.",
          });
        },
        onError: (error) => {
          toast.error("Erro ao atualizar perfil", { description: getErrorMessage(error) });
        },
      },
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-center py-8">
      <Card className="w-full max-w-md rounded-xl border-gray-200 bg-white shadow-none">
        <CardContent className="flex flex-col gap-8 p-8">
          <header className="flex flex-col items-center gap-6">
            <Avatar className="size-16">
              <AvatarFallback className="bg-gray-300 text-2xl text-gray-800">
                {getInitials(user?.name ?? "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-0.5 text-center">
              <h1 className="font-semibold text-gray-800 text-xl">{user?.name}</h1>
              <p className="text-base text-gray-500">{user?.email}</p>
            </div>
          </header>

          <Separator className="bg-gray-200" />

          {user && (
            // A key reinicia o formulário quando o nome salvo muda (após salvar ou revalidar).
            <ProfileForm
              key={user.name}
              user={user}
              isSaving={updateMutation.isPending}
              onSave={handleSave}
              onLogout={handleLogout}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

type ProfileFormProps = {
  user: User;
  isSaving: boolean;
  onSave: (name: string) => void;
  onLogout: () => void;
};

function ProfileForm({ user, isSaving, onSave, onLogout }: ProfileFormProps) {
  const [name, setName] = useState(user.name);
  const [nameError, setNameError] = useState<string>();

  const trimmedName = name.trim();
  const hasChanges = trimmedName !== user.name;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (trimmedName.length < NAME_MIN_LENGTH) {
      setNameError(`O nome deve ter no mínimo ${NAME_MIN_LENGTH} caracteres.`);
      return;
    }

    onSave(trimmedName);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        id="name"
        label="Nome completo"
        placeholder="Seu nome completo"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (nameError) setNameError(undefined);
        }}
        error={nameError}
        autoComplete="name"
        icon={UserRound}
      />
      <Input
        id="email"
        label="E-mail"
        type="email"
        value={user.email}
        disabled
        readOnly
        icon={Mail}
        helperText="O e-mail não pode ser alterado"
      />

      <div className="mt-2 flex flex-col gap-4">
        <Button type="submit" className="w-full" disabled={!hasChanges || isSaving}>
          {isSaving ? "Salvando..." : "Salvar alterações"}
        </Button>
        <Button variant="secondary" className="w-full" onClick={onLogout}>
          <LogOut aria-hidden="true" className="text-danger" />
          Sair da conta
        </Button>
      </div>
    </form>
  );
}
