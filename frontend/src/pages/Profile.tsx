import { LogOut, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/lib/format";
import { useAuthStore } from "@/stores/auth";

export function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrar com a mutation de atualização de perfil.
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="name"
              label="Nome completo"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              icon={UserRound}
            />
            <Input
              id="email"
              label="E-mail"
              type="email"
              value={user?.email ?? ""}
              disabled
              readOnly
              icon={Mail}
              helperText="O e-mail não pode ser alterado"
            />

            <div className="mt-2 flex flex-col gap-4">
              <Button type="submit" className="w-full">
                Salvar alterações
              </Button>
              <Button variant="secondary" className="w-full" onClick={handleLogout}>
                <LogOut aria-hidden="true" className="text-danger" />
                Sair da conta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
