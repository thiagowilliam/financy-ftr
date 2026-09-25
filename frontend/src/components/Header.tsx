import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth"
import logoIcon from "@/assets/logo-icon.svg"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { cn } from "@/lib/utils"

const activeLinkClass = "text-brand-base font-semibold"

export function Header() {
  const { user, logout, isAuthenticated } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const isDashboardPage = location.pathname === "/"
  const isTransactionsPage = location.pathname === "/transactions"
  const isCategoriesPage = location.pathname === "/categories"

  const initials = (user?.name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="w-full px-16 pt-6 bg-white border-b-2 border-gray-200 pb-4">
      {isAuthenticated && (
        <div className="flex justify-between w-full">
          <div className="min-w-48">
            <img src={logoIcon} alt="Financy" />
          </div>
          <div className="flex items-center gap-5 text-sm text-gray-600">
            <Link to="/" className={cn(isDashboardPage && activeLinkClass)}>
              Dashboard
            </Link>
            <Link to="/transactions" className={cn(isTransactionsPage && activeLinkClass)}>
              Transações
            </Link>
            <Link to="/categories" className={cn(isCategoriesPage && activeLinkClass)}>
              Categorias
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback className="bg-gray-300 text-gray-800" onClick={handleLogout}>
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}