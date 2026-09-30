import { Lock, LogOut, Mail, User } from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/graphql/client";
import { useAuthStore } from "@/stores/auth";

const MIN_PASSWORD_LENGTH = 8;
const PASSWORD_HINT = `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres`;

export function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [loading, setLoading] = useState(false);

  const signup = useAuthStore((state) => state.signup);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < MIN_PASSWORD_LENGTH) {
      setPasswordInvalid(true);
      return;
    }

    setPasswordInvalid(false);
    setLoading(true);

    try {
      const signupMutate = await signup({
        name,
        email,
        password,
      });
      if (signupMutate) {
        toast.success("Cadastro realizado com sucesso!");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao realizar o cadastro"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8">
      <img src={Logo} alt="Financy" className="h-8 w-auto" />
      <Card className="w-full max-w-md rounded-s-xl">
        <CardHeader>
          <CardTitle className="font-bold text-gray-800 text-xl">Criar conta</CardTitle>
          <CardDescription>Comece a controlar suas finanças ainda hoje</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                id="name"
                label="Nome completo"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                icon={User}
              />
            </div>
            <div>
              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={Mail}
              />
            </div>
            <div>
              <Input
                id="password"
                label="Senha"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordInvalid) setPasswordInvalid(false);
                }}
                required
                icon={Lock}
                helperText={PASSWORD_HINT}
                error={passwordInvalid ? PASSWORD_HINT : undefined}
              />
            </div>
            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              Cadastrar
            </Button>
          </form>
          <div className="relative my-6 flex h-5 w-full items-center justify-center">
            <hr className="w-full" />
            <span className="absolute inline-block bg-white px-3 text-gray-500">ou</span>
          </div>

          <p className="mb-4 text-center text-gray-600">Já tem uma conta?</p>
          <Button variant="secondary" className="w-full text-gray-700" asChild>
            <Link to="/login">
              {" "}
              <LogOut /> Fazer login{" "}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
