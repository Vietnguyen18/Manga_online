import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import "../dashboard.scss";
import { FilterManga } from "../../../../../../services/api";

const Books = () => {
  const [listBook, setListBook] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTotalPage, setIsTotalPage] = useState(null);

  const search = "S";
  const page = currentPage;
  useEffect(() => {
    const fetchFilterManga = async () => {
      const response = await FilterManga(search, page);
      setListBook(response.data);
      setIsTotalPage(response.total_page);
    };
    fetchFilterManga();
  }, [search, page]);

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };
  //   format views
  const formatViews = (views) => {
    if (views < 1000) {
      return views;
    } else if (views < 1000000) {
      return (views / 1000).toFixed(1) + "K";
    } else if (views < 1000000000) {
      return (views / 1000000).toFixed(1) + "M";
    } else {
      return (views / 1000000000).toFixed(1) + "B";
    }
  };
  return (
    <div className="content-book">
      <div className="table-container">
        <h3 className="tilte">Comic List</h3>
        <div className="table-content">
          <table>
            <thead>
              <tr>
                <th>Name Comic</th>
                <th>Poster</th>
                <th>Author</th>
                <th>Category</th>
                <th>Views</th>
              </tr>
            </thead>
            <tbody>
              {listBook.map((e, index) => (
                <tr key={e.id_manga}>
                  <td>{e.title}</td>
                  <td>
                    <img
                      src={e.poster}
                      alt={e.title}
                      style={{ width: "50px" }}
                    />
                  </td>
                  <td>{e.author}</td>
                  <td>
                    {e.categories.length > 30
                      ? `${e.categories.substring(0, 30)}.....`
                      : e.categories}
                  </td>
                  <td>{formatViews(e.views)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Button */}
        <div className="pagination-dashboard">
          <Pagination
            defaultCurrent={1}
            currentPage={currentPage}
            total={isTotalPage * 10}
            showSizeChanger={false}
            onChange={handlePaginationChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Books;
