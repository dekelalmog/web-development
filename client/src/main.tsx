import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from './App.tsx'
import Login from "./components/Login/login.tsx";
import UserPage from "./components/User-Page/User-Page.tsx";
import Register from "./components/Register/Register.tsx";
import Home from "./components/Home/Home.tsx";
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/user/:id",
    element: <UserPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <h1>404 Not Found</h1>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="179195132285-dqj43jg22th2lepi4ic5amt4eb4khhnl.apps.googleusercontent.com">
    <React.StrictMode>
      <RouterProvider router={router}></RouterProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
