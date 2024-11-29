import React, { useState } from "react";
import "./Login&Register.css";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { callLogin, callRegister } from "../../services/api";
import { message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  doLoginAction,
  doLoginDataUser,
} from "../../redux/account/accountSlice";
import { useDispatch } from "react-redux";
import localStorage from "redux-persist/lib/storage";

const LoginRegister = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Xác định hành động hiện tại là đăng nhập hay đăng ký
  const action = location.pathname === "/login" ? "login" : "register";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    const response = await callLogin(formData.email, formData.password);
    if (response?.data.status !== 200) {
      message.error(response.data.message);
      setLoading(false);
    } else {
      message.success(response?.data.message);
      localStorage.setItem("id_user", response?.data.data.id_user);
      localStorage.setItem("role", response?.data.data.role);
      localStorage.setItem("access_token", response?.data.access_token);

      document.cookie = `access_token_cookie=${response?.data.access_token}; path=/; Secure; SameSite=Strict`;
      dispatch(doLoginAction(JSON.parse(response?.config.data)));
      dispatch(doLoginDataUser(response?.data.data));
      setLoading(false);
      navigator("/");
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await callRegister(
        formData.username,
        formData.email,
        formData.password
      );

      if (response.status === 200) {
        message.success(response.message);
        navigator("/login"); // Sau khi đăng ký thành công, chuyển hướng về trang login
      } else {
        message.error(
          response.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during registration:", error);
      message.error(
        "An error occurred during registration. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body-container">
      <div className={`wrapper ${action === "register" ? "active" : ""}`}>
        {/* Form Đăng Nhập */}
        {action === "login" && (
          <div className="form-box login">
            <form onSubmit={handleLogin}>
              <h1>Login</h1>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <FaUser className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <FaLock className="icon" />
              </div>

              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <div className="remember-forgot">
                <label>
                  <input type="checkbox" />
                  Remember me
                </label>
                <a href="forgot-password">Forgot password?</a>
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
              <div className="register-link">
                <p>
                  Don't have an account?
                  <a href="/register">Register</a>
                </p>
              </div>
            </form>
          </div>
        )}

        {/* Form Đăng Ký */}
        {action === "register" && (
          <div className="form-box register">
            <form onSubmit={handleRegister}>
              <h1>Registration</h1>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <FaUser className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <FaEnvelope className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <FaLock className="icon" />
              </div>

              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <div className="remember-forgot">
                <label>
                  <input type="checkbox" />I agree to the terms & conditions
                </label>
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
              <div className="register-link">
                <p>
                  Already have an account?
                  <a href="/login">Login</a>
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginRegister;
