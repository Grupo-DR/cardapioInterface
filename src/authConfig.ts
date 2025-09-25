import type { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "0db3ca77-2cf5-4ef3-a115-ac5e76db0bec", // pegue no portal Azure
    authority:
      "https://login.microsoftonline.com/fa2cefb2-831d-4bde-b4b9-09d384a84ffd", // ou seu tenant específico
    redirectUri: "http://localhost:5173", // porta padrão do Vite
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read"], // permissões do Microsoft Graph ou API custom
};
