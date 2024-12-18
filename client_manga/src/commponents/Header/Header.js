import { Container, Navbar, Nav } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo_3.png";
import avatar from "../../assets/avatar-15-64.png";
import "./Header.scss";
import { Dropdown, Space, Avatar, List, notification, message } from "antd";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { callLogout, fetchUserByID, SearchManga } from "../../services/api";
import axios from "axios";
import { doSearch } from "../../redux/search/searchSlice";
import { HiOutlineLightBulb } from "react-icons/hi";
import { BsSearchHeart } from "react-icons/bs";
import { IoIosNotifications } from "react-icons/io";
import React from "react";
import ModalAccount from "../Auth/ModalAccount/ModalAccount";
import NavBar from "./NavBar";
import {
  formatRating,
  makeLink,
  removeVietnameseTones,
} from "../../utils/extend";
import { useDebounce } from "../../utils/useDebounce";

const Header = ({ isLight, setIsLight }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const datauser = useSelector((state) => state.account.dataUser);
  const [isShowModalLogin, setIsShowModalLogin] = useState(false);
  const [apiUser, setApiUser] = useState([]);
  const [nameUser, setNameUser] = useState("");
  const [listManga, setListManga] = useState([]);
  const [content, setContent] = useState("");
  const debount = useDebounce(content, 500);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  // thay doi gia dien
  useEffect(() => {
    const savedTheme = localStorage.getItem("isLight") === "true";
    setIsLight(savedTheme);

    // cap nhat
    document.body.style.backgroundColor = savedTheme ? "#ebebeb" : "#18191a";
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
    if (datauser?.id_user) {
      FetchUserData();
    }
  }, [datauser?.id_user]);

  let items = [
    {
      label: <Link to={`/profile/${nameUser}`}>Page profile</Link>,
      key: "userprofile",
    },

    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogOut()}>
          Logout
        </label>
      ),
      key: "logout",
    },
  ];
  if (datauser?.role === true) {
    items.unshift({
      label: <Link to="/admin">Page Admin</Link>,
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
      message.success("Signed out successfully!");
    } else {
      notification.error({
        message: "An error occurred",
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
    document.body.style.backgroundColor = newLight ? "#ebebeb" : "#18191a";
    const nav = document.getElementsByClassName("nav_bar");
    for (let i = 0; i < nav.length; i++) {
      nav[i].style.backgroundColor = newLight ? "#f18121" : "#242526";
    }
  };

  useEffect(() => {
    fetchSearchManga(debount);
  }, [debount]);

  const fetchSearchManga = async (content) => {
    const response = await SearchManga(content);
    setListManga(response.data);
  };
  const handleSearchChange = (e) => {
    setContent(e.target.value);
    setIsSearchPerformed(true);
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
              <input
                type="text"
                placeholder="Search for something here.........."
                value={content}
                onChange={handleSearchChange}
              />
              <button className="btn_search">
                <span className="icon_btn_search">
                  <BsSearchHeart />
                </span>
              </button>
              <div
                className={`search_result ${
                  isSearchPerformed && listManga.length > 0 ? "visible" : ""
                }`}
              >
                <ul>
                  {isSearchPerformed ? (
                    listManga.length > 0 ? (
                      listManga.map((manga, index) => (
                        <li key={manga.id_manga}>
                          <a
                            href={makeLink("truyen-tranh", manga.name_path)}
                            title={manga.title}
                          >
                            <div className="search_avatar">
                              <img src={manga.poster} alt={manga.title} />
                            </div>
                            <div className="search_info">
                              <p className="name_manga">{manga.title}</p>
                              <p className="author">{manga.author}</p>
                              <p className="rate">{formatRating(manga.rate)}</p>
                            </div>
                          </a>
                        </li>
                      ))
                    ) : (
                      <p>không có dữ liệu</p>
                    )
                  ) : null}
                </ul>
              </div>
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
                  Login
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
