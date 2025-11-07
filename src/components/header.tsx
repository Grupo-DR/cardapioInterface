import { msalInstance } from "../main";
import { Logo } from "@/assets/logo";
import { SignOutIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export default function Header() {
  const handleLogout = () => {
    msalInstance.logoutRedirect();
  };

  return (
    <header className="flex w-full justify-between p-4 pt-1 items-center">
      <div className="flex items-center gap-8">
        <Link to="/">
          <Logo width="160px" />
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            className="bg-slate-200 hover:bg-slate-300 py-1 px-2 rounded"
            to="/"
          >
            Cardápio
          </Link>
          <Link
            className="bg-slate-200 hover:bg-slate-300 py-1 px-2 rounded"
            to="/employes"
          >
            Funcionários
          </Link>
          <Link
            className="bg-slate-200 hover:bg-slate-300 py-1 px-2 rounded"
            to="/menu"
          >
            Cádapio da semana
          </Link>
          <Link
            className="bg-slate-200 hover:bg-slate-300 py-1 px-2 rounded"
            to="/lunch"
          >
            Escolha de terceiro
          </Link>
        </nav>
      </div>

      <div
        onClick={handleLogout}
        className="p-3 gap-2 hover:text-red-600 flex text-base justify-center items-center cursor-pointer"
      >
        Sair
        <SignOutIcon size={24} weight="bold" />
      </div>
    </header>
  );
}
