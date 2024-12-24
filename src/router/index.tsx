import { lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import NotFound from "../templates/pages/NotFound";
import Dashboard from "../pages/Dashboard";
import { Chat } from "../pages/Chat";

const Login: React.LazyExoticComponent<any> = lazy(() => import("../pages/Login"));

function Router(): JSX.Element {
    const router = createBrowserRouter([
        {
            path: "/login",
            element: <Login />,
            errorElement: <NotFound />,
        },
        {
            path: "/",
            element: <Chat />,
            errorElement: <NotFound />,
        },
        {
            path: "dashboard",
            element: <Dashboard />,
            errorElement: <NotFound />
        }
    ]);

    return (
        <RouterProvider router={router} />
    )
}

export default Router;
