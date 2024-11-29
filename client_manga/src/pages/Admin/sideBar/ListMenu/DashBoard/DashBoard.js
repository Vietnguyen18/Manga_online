import React from "react";
import "./dashboard.scss";
import HeaderContent from "./HeaderContent";
import Information from "./ContentDash/Information";
import Chart from "./ContentDash/Chart";
import Books from "./ContentDash/Books";

const DashBoard = () => {
  return (
    <div className="dashboard">
      <div className="container-dashboard">
        <HeaderContent />
        <Information />
        <Chart />
        <Books />
      </div>
    </div>
  );
};

export default DashBoard;
