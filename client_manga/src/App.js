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
import Books from "./pages/Admin/sideBar/ListMenu/Books/Books";
import ProfileUser from "./pages/ProfileUser/ProfileUser";
import DetailManga from "./commponents/MangaItem/DetailManga/DetailManga";
import ReadManga from "./commponents/MangaItem/DetailManga/ReadManga/ReadManga";
import Search from "./commponents/Search/Search";
import Description from "./commponents/Description/Description";

const Layout = () => {
  const [isLight, setIsLight] = useState(true);

  return (
    <>
      <div className="app-header">
        <Header isLight={isLight} setIsLight={setIsLight} />
      </div>
      <div className="app-content">
        <Outlet context={{ isLight }} />
      </div>
      <div className="app-footer">
        <Footer isLight={isLight} />
      </div>
    </>
  );
};

function App() {
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
          path: "/tim-kiem-nang-cao",
          element: <Search />,
        },
        {
          path: "/truyen-moi-cap-nhat/:page",
          element: <Recommended />,
        },
        {
          path: "/truyen-tranh/:namePath",
          element: <DetailManga />,
        },
        {
          path: "/truyen-tranh/:namePath/:chapterId",
          element: <ReadManga />,
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
        {
          path: "/admin/books",
          element: <Books />,
        },
      ],
    },
    {
      path: "/profile/:nameUser",
      element: <ProfileUser />,
    },
    {
      path: "/mo-ta",
      element: <Description />,
    },
  ];
  const router = createBrowserRouter(item);
  return <>{<RouterProvider router={router} />}</>;
}
export default App;
