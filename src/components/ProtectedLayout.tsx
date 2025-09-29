// src/components/ProtectedLayout.tsx
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";

export const ProtectedLayout: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress } = useMsal();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && inProgress === InteractionStatus.None) {
      instance
        .loginRedirect({
          ...loginRequest,
          state: encodeURIComponent(location.pathname),
        })
        .catch((e) => {
          console.error("Erro ao chamar loginRedirect:", e);
        });
    }
  }, [isAuthenticated, inProgress, instance, location]);

  if (!isAuthenticated) {
    return <div className="p-5">Redirecionando para login...</div>;
  }

  return <Outlet />;
};
