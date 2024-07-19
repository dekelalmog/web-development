import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.tsx'
import './index.css'

import Login from './components/Login/login.tsx';
import UserPage from './components/User-Page/user-page.tsx';
import Register from './components/Register/Register.tsx';
import Home from './components/Home/Home.tsx';


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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}>
    </RouterProvider>
  </React.StrictMode>,
)