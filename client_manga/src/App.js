import logo from "./logo.svg";
import "./App.scss";
import "./index.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import NotFound from "./commponents/NotFound";
import Header from "./commponents/Header/Header";
import { HiMoon } from "react-icons/hi";
import Home from "./commponents/Home/Home";
import Recommended from "./commponents/MangaItem/Recommended/Recommended";
import FilterCategory from "./commponents/MangaItem/FilterCategory/FilterCategory";
import FilterRank from "./commponents/MangaItem/FilterRank/FilterRank";
import HistoryRead from "./commponents/History/HistoryRead";
import LoginRegister from "./pages/Login&Register/Login&Register";

const Layout = () => {
  return (
    <>
      <div className="app-header">
        <Header />
      </div>
      <div className="app-content">
        <Outlet />
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
      path: `/login`,
      element: <LoginRegister />,
    },
  ];
  const router = createBrowserRouter(item);
  return <>{<RouterProvider router={router} />}</>;
}
export default App;
