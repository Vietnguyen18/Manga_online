import "./App.scss";
import "./index.css";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { useSelector } from "react-redux";
import NotFound from "./commponents/NotFound";
import Header from "./commponents/Header/Header";
import Home from "./commponents/Home/Home";
import Recommended from "./commponents/MangaItem/Recommended/Recommended";
import FilterCategory from "./commponents/MangaItem/FilterCategory/FilterCategory";
import FilterRank from "./commponents/MangaItem/FilterRank/FilterRank";
import HistoryRead from "./commponents/History/HistoryRead";
import LoginRegister from "./pages/Login&Register/Login&Register";
import Footer from "./commponents/Footer/Footer";
import { useState } from "react";
import Admin from "./pages/Admin/Admin";
import DashBoard from "./pages/Admin/sideBar/ListMenu/DashBoard/DashBoard";
import User from "./pages/Admin/sideBar/ListMenu/User/User";

const Layout = () => {
  const [isLight, setIsLight] = useState(true);

  return (
    <>
      <div className="app-header">
        <Header isLight={isLight} setIsLight={setIsLight} />
      </div>
      <div className="app-content">
        <Outlet />
      </div>
      <div className="app-footer">
        <Footer isLight={isLight} />
      </div>
    </>
  );
};

function App() {
  const datauser = useSelector((state) => state.account.dataUser);
  const item = [
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/the-loai/:category",
          element: <FilterCategory />,
        },
        {
          path: "/xep-hang/:rank",
          element: <FilterRank />,
        },
        {
          path: "/lich-su/:idUser",
          element: <HistoryRead />,
        },
        {
          path: "/truyen-moi-cap-nhat/:page",
          element: <Recommended />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginRegister />,
    },
    {
      path: "/register",
      element: <LoginRegister />,
    },
    {
      path: "/admin",
      element: <Admin />,
      children: [
        {
          index: true,
          element: <Navigate to="/admin/dashboard" replace />,
        },
        {
          path: "/admin/dashboard",
          element: <DashBoard />,
        },
        {
          path: "/admin/user",
          element: <User />,
        },
      ],
    },
  ];
  const router = createBrowserRouter(item);
  return <>{<RouterProvider router={router} />}</>;
}
export default App;
