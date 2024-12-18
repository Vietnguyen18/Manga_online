import React, { useState, useRef } from "react";
import "./Navbar.scss";
import { Container } from "react-bootstrap";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import ModalCategory from "./Modal_categody/ModalCategory";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isShowModalCate, setIsShowModalCate] = useState(false);
  const hoverTime = useRef(null);
  const [istype, setIsType] = useState(null);
  const id_user = localStorage.getItem("id_user");
  const navigate = useNavigate();

  const handelShow = (type) => {
    setIsType(type);
    clearTimeout(hoverTime.current);
    hoverTime.current = setTimeout(() => {
      setIsShowModalCate(true);
    }, 200);
  };
  const handleClose = () => {
    clearTimeout(hoverTime.current);
    hoverTime.current = setTimeout(() => {
      setIsShowModalCate(false);
    }, 300);
  };
  const handleNavigate = () => {
    navigate(`/lich-su/${id_user}`);
  };

  return (
    <>
      <Container>
        <ul className="menu">
          <a href="/">
            <li>Home</li>
          </a>
          <li
            className="menu_hidden"
            onMouseEnter={() => handelShow("category")}
            onMouseLeave={handleClose}
          >
            <span>Categories</span>
            <i className="icon_arrow">
              <IoIosArrowDropdownCircle />
            </i>
          </li>
          <li
            className="menu_hidden"
            onMouseEnter={() => handelShow("rank")}
            onMouseLeave={handleClose}
          >
            <span>Ranking</span>
            <i className="icon_arrow">
              <IoIosArrowDropdownCircle />
            </i>
          </li>
          <a href="/tim-kiem-nang-cao">
            <li>Search Comics</li>
          </a>
          <a to="/lich-su" onClick={() => handleNavigate()}>
            <li>History</li>
          </a>
          <a href="/mo-ta">
            <li>Description</li>
          </a>
        </ul>
      </Container>
      {isShowModalCate && (
        <ModalCategory
          onMouseEnter={() => clearTimeout(hoverTime.current)}
          onMouseLeave={handleClose}
          type={istype}
        />
      )}
    </>
  );
};

export default NavBar;
