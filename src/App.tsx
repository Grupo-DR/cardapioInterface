import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/header";
import { msalInstance } from "./main";
import { useEffect } from "react";
import { loginRequest } from "./authConfig.ts";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "./pages";
import { AddEmploye } from "./pages/addEmploye.tsx";
import { Menu } from "./pages/menu.tsx";
import Lunch from "./pages/lunch.tsx";

export default function App() {
  const { accounts, inProgress } = useMsal();
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname !== "/lunch" &&
      inProgress === InteractionStatus.None &&
      accounts.length === 0
    ) {
      msalInstance.loginRedirect(loginRequest);
    }
  }, [accounts, inProgress, location]);

  if (
    location.pathname !== "/lunch" &&
    (inProgress !== InteractionStatus.None || accounts.length === 0)
  ) {
    return <div className="p-5">Redirecionando para login...</div>;
  }

  return (
    <div className="p-5">
      {accounts.length !== 0 ? <Header /> : null}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/employes" element={<AddEmploye />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/lunch" element={<Lunch />} />
      </Routes>
      <Toaster />
    </div>
  );
}
