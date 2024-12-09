import React, { useState } from "react";
import "./user.scss";
import HeaderContent from "./HeaderContent";
import ListUser from "./ContentUser/ListUser";
import { useDebounce } from "../../../../../utils/useDebounce";

const User = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  return (
    <div className="user">
      <div className="container-user">
        <HeaderContent setSearch={setSearch} />
        <ListUser search={debouncedSearch} />
      </div>
    </div>
  );
};

export default User;
