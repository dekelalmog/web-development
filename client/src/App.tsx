import { useRoutes } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Login/login';
import Register from './components/Register/Register';
import PostPage from './components/PostPage/PostPage';
import Profile from './components/Profile/Profile';

function App() {

  const routes = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/post/:id",
      element: <PostPage />,
    },
    {
      path: "*",
      element: <h1>404 Not Found</h1>,
    },
  ]);
  
  return routes;
}

export default App
