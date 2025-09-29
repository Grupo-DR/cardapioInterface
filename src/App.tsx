import { Routes, Route } from "react-router-dom";
import Header from "./components/header";
import { useMsal } from "@azure/msal-react";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "./pages";
import { AddEmploye } from "./pages/addEmploye";
import { Menu } from "./pages/menu";
import Lunch from "./pages/lunch";
import { ProtectedLayout } from "./components/ProtectedLayout";

export default function App() {
  const { accounts } = useMsal();

  return (
    <div className="p-5">
      {accounts.length > 0 && <Header />}
      <Routes>
        <Route path="/lunch" element={<Lunch />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/employes" element={<AddEmploye />} />
          <Route path="/menu" element={<Menu />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
}
