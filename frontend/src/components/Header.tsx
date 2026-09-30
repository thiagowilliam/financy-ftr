import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.svg";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAuthStore } from "../stores/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";

const activeLinkClass = "text-brand-base font-semibold";

export function Header() {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboardPage = location.pathname === "/";
  const isTransactionsPage = location.pathname === "/transactions";
  const isCategoriesPage = location.pathname === "/categories";

  const initials = getInitials(user?.name ?? "");

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="w-full border-gray-200 border-b-2 bg-white px-16 pt-6 pb-4">
      {isAuthenticated && (
        <div className="flex w-full items-center justify-between">
          <div className="min-w-48">
            <img src={logo} alt="Financy" className="h-6 w-auto" />
          </div>
          <div className="flex items-center gap-5 text-gray-600 text-sm">
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
              <button
                type="button"
                onClick={goToProfile}
                aria-label="Ir para o perfil"
                className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Avatar>
                  <AvatarFallback className="bg-gray-300 text-gray-800">{initials}</AvatarFallback>
                </Avatar>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
