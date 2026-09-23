import {
  Mail,
  Lock,
  UserRoundPlus
} from "lucide-react";

import { useState } from "react";
import Logo from "@/assets/logo.svg"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

    try {
      const loginMutate = await login({
        email,
        password,
      })
      if (loginMutate) {
        toast.success("Login realizado com sucesso!")
      }
    } catch (error) {
      toast.success("Falha ao realizar o login!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center gap-8">
      <img src={Logo} alt="Financy" className="h-8 w-auto" />
      <Card className="w-full max-w-md rounded-s-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 text-center">
            Fazer login
          </CardTitle>
          <CardDescription className="text-center text-base">
            Entre na sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                id="email"
                label="E-mail"
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
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={Lock}
              />
            </div>

            <div className="flex items-center justify-between ml-1">
              <Field orientation="horizontal" className="w-auto gap-2">
                <Checkbox id="remember-me" name="remember-me" />
                <FieldLabel htmlFor="remember-me" className="text-gray-700 text-sm">
                  Lembrar-me
                </FieldLabel>
              </Field>
              <Link
                to="/forgot-password"
                className="rounded-sm font-medium text-brand-base text-sm transition-colors hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Recuperar senha
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              Entrar
            </Button>
          </form>
          <div className="relative w-full h-5 flex items-center justify-center my-6">
            <hr className="w-full"/>
            <span className="absolute inline-block bg-white px-3 text-gray-500">ou</span>
          </div>

          <p className="text-center text-gray-600 mb-4">Ainda não tem uma conta?</p>
          <Button variant="secondary" className="w-full text-gray-700" asChild>
            <Link to="/signup"> <UserRoundPlus /> Criar conta </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 