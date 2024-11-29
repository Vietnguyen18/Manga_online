import React from "react";
import { BiNotification, BiSearch } from "react-icons/bi";
import "../../../index.scss";

const HeaderContent = () => {
  return (
    <>
      <div className="content-header">
        <h1 className="header-title">User</h1>
        <div className="header-activity">
          <div className="search-box">
            <input type="text" placeholder="Search anything here....." />
            <i className="icon">
              <BiSearch />
            </i>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderContent;
