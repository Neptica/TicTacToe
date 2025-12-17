import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import "./index.scss";
import App from "./App.tsx";
import { createBrowserRouter } from "react-router";
import Layout from "./pages/Layout.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import { Auth0Provider, type AppState } from "@auth0/auth0-react";
import SignOutPage from "./pages/SignOutPage.tsx";
import GamePage from "./pages/GamePage.tsx";
import ProtectedRoute from "./lib/ProtectedRoute.tsx";

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      {
        index: true,
        Component: App,
      },
      {
        path: "/sign-in",
        Component: SignInPage,
      },
      {
        Component: ProtectedRoute,
        children: [
          {
            path: "/game", // Probably need to be changed
            Component: GamePage,
          },
          {
            path: "/sign-out",
            Component: SignOutPage,
          },
        ],
      },
    ],
  },
]);

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      // cacheLocation="localstorage" // Keep the user logged in across pages. Might be a different way that you want to use
    >
      <RouterProvider router={router} />
    </Auth0Provider>
  </StrictMode>,
);
