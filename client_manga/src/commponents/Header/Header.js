import { Container, Navbar, Nav } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo_3.png";
import avatar from "../../assets/avatar-15-64.png";
import "./Header.scss";
import { Dropdown, Space, Avatar, List, notification, message } from "antd";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { callLogout, fetchUserByID } from "../../services/api";
import axios from "axios";
import { doSearch } from "../../redux/search/searchSlice";
import { HiOutlineLightBulb } from "react-icons/hi";
import { BsSearchHeart } from "react-icons/bs";
import { IoIosNotifications } from "react-icons/io";
import React from "react";
import ModalAccount from "../Auth/ModalAccount/ModalAccount";
import NavBar from "./NavBar";
import { removeVietnameseTones } from "../../utils/extend";

const Header = ({ isLight, setIsLight }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const datauser = useSelector((state) => state.account.dataUser);
  const [isShowModalLogin, setIsShowModalLogin] = useState(false);
  const [apiUser, setApiUser] = useState([]);
  const [nameUser, setNameUser] = useState("");

  // thay doi gia dien
  useEffect(() => {
    const savedTheme = localStorage.getItem("isLight") === "true";
    setIsLight(savedTheme);

    // cap nhat
    document.body.style.backgroundColor = savedTheme ? "#fff" : "#18191a";
    const nav = document.getElementsByClassName("nav_bar");
    for (let i = 0; i < nav.length; i++) {
      nav[i].style.backgroundColor = savedTheme ? "#f18121" : "#242526";
    }
  }, [setIsLight]);
  // User
  useEffect(() => {
    const FetchUserData = async () => {
      try {
        if (datauser?.id_user) {
          const user = await fetchUserByID(datauser?.id_user);
          setApiUser(user);
          setNameUser(removeVietnameseTones(user?.name_user));
        } else {
          message.error("Please log in to use full functionality");
        }
      } catch (er) {
        console.error("Error fetching user data: ", er);
        message.error("Failed to fetch user data");
      }
    };
    FetchUserData();
  }, [datauser?.id_user]);

  let items = [
    {
      label: <Link to={`/profile/${nameUser}`}>Trang profile</Link>,
      key: "userprofile",
    },

    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogOut()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];
  if (datauser?.role === true) {
    items.unshift({
      label: <Link to="/admin">Trang quản trị</Link>,
      key: "admin",
    });
  }

  const handleClose = () => {
    setIsShowModalLogin(false);
  };

  const handleLogOut = async () => {
    const res = await callLogout();
    if (res) {
      localStorage.removeItem("id_user");
      localStorage.removeItem("role");
      localStorage.removeItem("access_token");
      dispatch(doLogoutAction());
      navigate("/");
      message.success("Đăng xuất thành công!");
    } else {
      notification.error({
        message: "Có lỗi xáy ra",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message[1],
        duration: 5,
      });
    }
  };
  const handelLight = () => {
    const newLight = !isLight;
    setIsLight(newLight);
    localStorage.setItem("isLight", newLight);
    document.body.style.backgroundColor = newLight ? "#fff" : "#18191a";
    const nav = document.getElementsByClassName("nav_bar");
    for (let i = 0; i < nav.length; i++) {
      nav[i].style.backgroundColor = newLight ? "#f18121" : "#242526";
    }
  };
  return (
    <>
      <Container>
        {/* top header */}
        <div className="top">
          <div className="logo">
            <a href="/" title="Trang Chu MANGATOON">
              <img className="w-[200px]" src={logo} alt="Logo MANGATOON" />
            </a>
            <i
              onClick={() => handelLight()}
              style={{
                backgroundColor: isLight ? "#333" : "#fff",
                color: isLight ? "#fff" : "#333",
              }}
            >
              <HiOutlineLightBulb />
            </i>
            <div className="search">
              <input type="text" placeholder="Tim kiem chuyen.........." />
              <button className="btn_search">
                <span className="icon_btn_search">
                  <BsSearchHeart />
                </span>
              </button>
            </div>
            <div className="header-notification">
              <i
                style={{
                  color: isLight ? "#333" : "#fff",
                }}
              >
                <IoIosNotifications />
              </i>
            </div>
            <div className="account">
              {!isAuthenticated ? (
                <button
                  className="btn"
                  onClick={() => setIsShowModalLogin(true)}
                >
                  Đăng nhập
                </button>
              ) : (
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <a
                    style={{ color: "#fff", cursor: "pointer" }}
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Space
                      className="avatar"
                      style={{ color: isLight ? "#333" : "#fff" }}
                    >
                      <Avatar src={apiUser?.avatar_user || avatar} />
                      {apiUser?.name_user}
                    </Space>
                  </a>
                </Dropdown>
              )}
            </div>
          </div>
          <ModalAccount show={isShowModalLogin} handleClose={handleClose} />
        </div>
      </Container>
      {/* nav_bar header */}
      <div className="nav_bar">
        <NavBar />
      </div>
    </>
  );
};

export default Header;
