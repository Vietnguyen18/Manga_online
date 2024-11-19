import React, { useState, useRef } from "react";
import "./Navbar.scss";
import { Container } from "react-bootstrap";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import ModalCategory from "./Modal_categody/ModalCategory";

const NavBar = () => {
  const [isShowModalCate, setIsShowModalCate] = useState(false);
  const hoverTime = useRef(null);
  const [istype, setIsType] = useState(null);
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
  return (
    <>
      <Container>
        <ul className="menu">
          <a href="/">
            <li>Trang Chủ</li>
          </a>
          <li
            className="menu_hidden"
            onMouseEnter={() => handelShow("category")}
            onMouseLeave={handleClose}
          >
            <span>Thể Loại</span>
            <i className="icon_arrow">
              <IoIosArrowDropdownCircle />
            </i>
          </li>
          <li
            className="menu_hidden"
            onMouseEnter={() => handelShow("rank")}
            onMouseLeave={handleClose}
          >
            <span>Xếp Hạng</span>
            <i className="icon_arrow">
              <IoIosArrowDropdownCircle />
            </i>
          </li>
          <a href="/tim-truyen">
            <li>Tìm Truyện</li>
          </a>
          <a href="/lich-su">
            <li>Lịch Sử</li>
          </a>
          <a href="/theo-doi">
            <li>Theo Dõi</li>
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
