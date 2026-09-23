import {
  Mail,
  Lock,
  User
} from "lucide-react";

import { useState } from "react";
import Logo from "@/assets/logo.svg"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";

export function Signup() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const signup = useAuthStore((state) => state.signup)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const signupMutate = await signup({
        name,
        email,
        password,
      })
      if (signupMutate) {
        toast.success("Cadastro realizado com sucesso!")
      }
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : "Erro ao realizar o cadastro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center gap-8">
      <img src={Logo} alt="Financy" className="h-8 w-auto" />
      <Card className="w-full max-w-md rounded-s-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            Criar conta
          </CardTitle>
          <CardDescription>
            Comece a controlar suas finanças ainda hoje
          </CardDescription>
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
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={Lock}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              Cadastrar
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="w-full max-w-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Já tem uma conta?
          </CardTitle>
          <CardDescription>Cadastre-se agora mesmo</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" className="w-full" asChild >
            <Link to="/login"> Fazer login </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 