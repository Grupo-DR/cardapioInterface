import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig.ts";
import { BrowserRouter } from "react-router-dom";

// Cria a instância MSAL
export const msalInstance = new PublicClientApplication(msalConfig);

// Renderiza a aplicação
ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MsalProvider instance={msalInstance}>
      <div className="p-6">
        <App />
      </div>
    </MsalProvider>
  </BrowserRouter>,
);
