import logo from "./logo.svg";
import "./App.scss";
import "./index.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import NotFound from "./commponents/NotFound";
import Header from "./commponents/Header/Header";
import { HiMoon } from "react-icons/hi";
import Home from "./commponents/Home/Home";

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
      ],
    },
  ];
  const router = createBrowserRouter(item);
  return <>{<RouterProvider router={router} />}</>;
}
export default App;
