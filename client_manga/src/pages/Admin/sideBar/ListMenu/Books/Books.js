import React, { useState } from "react";
import { useDebounce } from "../../../../../utils/useDebounce";
import HeaderContent from "./HeaderContent";
import ListManga from "./ContentBooks/ListManga";
import "./books.scss";

const Books = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  return (
    <div className="list_manga">
      <div className="container_list_manga">
        <HeaderContent setSearch={setSearch} />
        <ListManga search={debouncedSearch} />
      </div>
    </div>
  );
};

export default Books;
