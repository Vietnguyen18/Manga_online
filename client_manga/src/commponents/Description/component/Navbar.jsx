import React from "react";
import Logo from "../../../assets/image/logo_3.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigate = () => {
    navigate("/");
  };

  return (
    <nav className="nav-des">
      <div className="nav-logo-container" onClick={handleNavigate}>
        <img src={Logo} alt="Logo" />
      </div>
      <div className="navbar-links-container">
        <button onClick={() => handleScroll("home")}>Trang chủ</button>
        <button onClick={() => handleScroll("about")}>Giới thiệu</button>
        <button onClick={() => handleScroll("contact")}>Liên hệ</button>
        <button className="primary-button" onClick={handleNavigate}>
          Khám phá ngay
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
