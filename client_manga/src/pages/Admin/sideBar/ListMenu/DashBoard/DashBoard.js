import React, { useState } from "react";
import "./dashboard.scss";
import HeaderContent from "./HeaderContent";
import Information from "./ContentDash/Information";
import Chart from "./ContentDash/Chart";
import ListBooks from "./ContentDash/ListBooks";
import { useDebounce } from "../../../../../utils/useDebounce";

const DashBoard = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  return (
    <div className="dashboard">
      <div className="container-dashboard">
        <HeaderContent setSearch={setSearch} />
        <Information />
        <Chart />
        <ListBooks search={debouncedSearch} />
      </div>
    </div>
  );
};

export default DashBoard;
