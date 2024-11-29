import React from "react";
import "./Footer.scss";
import { Container } from "react-bootstrap";
import logo from "../../assets/logo_3.png";
import banner from "../../assets/banner.jpg";
import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

const Footer = ({ isLight }) => {
  return (
    <>
      <div
        className="line-footer"
        style={{
          border: `3px solid ${isLight ? "#f18121" : "#e4e6eb"}`,
        }}
      ></div>
      <Container>
        <div className="footer-container">
          <div className="left-content">
            <span className="logo">
              <img src={logo} alt="anh logo " className=" w-[200px]" />
            </span>
            <span className="banner">
              <img src={banner} alt="banner" className=" w-[400px]" />
            </span>
          </div>
          <div
            className="right-content"
            style={{ color: isLight ? "#333" : "#fff" }}
          >
            <div class="footer-links">
              <h4>
                Bạn có thể chọn vào các đường link để đi tới trang bạn muốn.
              </h4>
              <ul className="list_link">
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Category</a>
                </li>
                <li>
                  <a href="#">History</a>
                </li>
                <li>
                  <a href="#">Follow</a>
                </li>
              </ul>
            </div>
            <div class="footer-social">
              <h3>Follow Us</h3>
              <div class="social-icon">
                <a href="#">
                  <i>
                    <FaFacebook />
                  </i>
                </a>
                <a href="#">
                  <i>
                    <FaYoutube />
                  </i>
                </a>
              </div>
            </div>
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Footer;
