import React from "react";
import { BiNotification, BiSearch } from "react-icons/bi";
import avatar from "../../../../../assets/avatar-15-64.png";
import { useSelector } from "react-redux";
import "../../../index.scss";

const HeaderContent = ({ search, setSearch }) => {
  const user = useSelector((state) => state.account.dataUser);
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  return (
    <>
      <div className="content-header">
        <h1 className="header-title">DashBoard</h1>
        <div className="header-activity">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search anything here....."
              value={search}
              onChange={handleSearchChange}
            />
            <i className="icon">
              <BiSearch />
            </i>
          </div>
          <div className="account">
            <img src={user.avatar} alt="avatar account" />
            <p>{user.name}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderContent;
