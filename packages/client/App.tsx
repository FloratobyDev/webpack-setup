import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Analytics from "./pages/Analytics";
import Journal from "./pages/Journal";
import Login from "./pages/Login";
import NavBar from "./components/layout/NavBar";
import NotFound from "./pages/NotFound";
import PageLayout from "./components/layout/PageLayout";
import Profile from "./pages/Profile";
import React from "react";
import RepositoryProvider from "./contexts/RepositoryContext";
import Settings from "./pages/Settings";
import { useAuth } from "./contexts/AuthProvider";

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <PageLayout>
        <NavBar />
        <Outlet />
      </PageLayout>
    ),
    children: [
      {
        path: "/journal",
        element: <Journal />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/analytics",
        element: <Analytics />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <RepositoryProvider>
      <RouterProvider router={routes} />
    </RepositoryProvider>
  );
}

export default App;
