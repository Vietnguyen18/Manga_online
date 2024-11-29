import React, { useState } from "react";
import "./index.scss";
import SideBar from "./sideBar/SideBar";
import { IoMenu } from "react-icons/io5";
import avatar from "../../assets/avatar-15-64.png";
import logo from "../../assets/logo_3.png";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const Admin = () => {
  const user = useSelector((state) => state.account.dataUser);
  const [isOpenMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu(!isOpenMenu);
  };

  return (
    <>
      <div className="menu-small">
        <i className="icon-nav" onClick={toggleMenu}>
          <IoMenu />
        </i>
        <div className="logo">
          <a href="/" title="page home">
            <img src={logo} alt="Logo mangatoon" />
          </a>
        </div>
        <div className="account">
          <img src={user.avatar} alt="avatar account" />
        </div>
      </div>
      <div className="admin-container">
        <div className={`sidebar-mobile ${isOpenMenu ? "open" : ""}`}>
          <SideBar />
        </div>
        <div className="sidebar">
          <SideBar />
          <div className="content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
