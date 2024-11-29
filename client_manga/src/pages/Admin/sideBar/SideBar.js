import React from "react";
import "../index.scss";
import { BiBook, BiHome, BiSolidReport, BiTask, BiUser } from "react-icons/bi";
import logo from "../../../assets/logo_3.png";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="menu">
      <div className="logo">
        <NavLink to="/" title="page home">
          <img src={logo} alt="Logo mangatoon" />
        </NavLink>
      </div>
      <div className="menu-list">
        <NavLink to="/admin/dashboard" className="item">
          <i className="icon">
            <BiTask />
          </i>
          Dashboard
        </NavLink>
        <NavLink to="/admin/user" className="item">
          <i className="icon">
            <BiUser />
          </i>
          User
        </NavLink>
        <NavLink to="/admin/books" className="item">
          <i className="icon">
            <BiBook />
          </i>
          Books
        </NavLink>
        <NavLink to="/admin/report" className="item">
          <i className="icon">
            <BiSolidReport />
          </i>
          Report
        </NavLink>
      </div>
    </div>
  );
};

export default SideBar;
