import { Container, Navbar, Nav } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo_3.png";
import avatar from "../../assets/avatar-15-64.png";
import "./Header.scss";
import { Dropdown, Space, Avatar, List, notification } from "antd";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { callLogout, fetchAccount } from "../../services/api";
import axios from "axios";
import { doSearch } from "../../redux/search/searchSlice";
import { HiOutlineLightBulb } from "react-icons/hi";
import { BsSearchHeart } from "react-icons/bs";
import { IoIosNotifications } from "react-icons/io";
import React from "react";
import ModalAccount from "../Auth/ModalAccount/ModalAccount";
import NavBar from "./NavBar";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const datauser = useSelector((state) => state.account.dataUser?.data);
  const [isLight, setIsLight] = useState(true);
  const [isShowModalLogin, setIsShowModalLogin] = useState(false);
  const [apiUser, setApiUser] = useState([]);
  console.log(apiUser);

  // User
  useEffect(() => {
    const FetchUserData = async () => {
      try {
        if (datauser?.id_user) {
          const useList = await fetchAccount();
          const user = useList.list_all_user;
          const fetchedUser = user.find(
            (user) => user?.id_user === datauser?.id_user
          );
          fetchedUser && setApiUser(fetchedUser);
        }
      } catch (er) {
        console.error("Error fetching user data: ", er);
        notification.error({
          message: "Error",
          description: "Failed to fetch user data",
        });
      }
    };
    FetchUserData();
  }, [datauser?.id_user]);

  let items = [
    {
      label: <Link to="/userprofile">Trang profile</Link>,
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
    const res = await callLogout(datauser?.id_user);
    if (res) {
      dispatch(doLogoutAction());
      navigate("/");
      // message.success("Đăng xuất thành công!");
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
    setIsLight(!isLight);
    document.body.style.backgroundColor = isLight ? "#ffff" : "#18191a";
    const nav = document.getElementsByClassName("nav_bar");
    for (let i = 0; i < nav.length; i++) {
      nav[i].style.backgroundColor = isLight ? "#f18121" : "#242526";
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
                backgroundColor: isLight ? "#fff" : "#333",
                color: isLight ? "#333" : "#fff",
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
              <i>
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
                    <Space>
                      <Avatar src={apiUser?.avatarLink || avatar} />
                      {apiUser?.FullName}
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
