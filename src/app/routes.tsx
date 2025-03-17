import { createBrowserRouter } from "react-router";
import { Login } from "./pages/LoginPage";
import { DogMatchPage } from "./pages/DogMatchPage";
import { NavigationLayout } from "./components/NavigationLayout";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: <NavigationLayout />,
    children: [
      {
        index: true,
        Component: DogMatchPage,
      },
    ],
  },
]);
