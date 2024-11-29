import React from "react";
import "./user.scss";
import HeaderContent from "./HeaderContent";
import Books from "./ContentUser/Books";

const User = () => {
  return (
    <div className="user">
      <div className="container-user">
        <HeaderContent />
        <Books />
      </div>
    </div>
  );
};

export default User;
