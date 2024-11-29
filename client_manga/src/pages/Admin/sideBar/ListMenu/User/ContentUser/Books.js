import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import "../user.scss";
import { FilterManga } from "../../../../../../services/api";
import { IoIosCreate } from "react-icons/io";

const Books = () => {
  const [listBook, setListBook] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTotalPage, setIsTotalPage] = useState(null);

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className="content-book">
      <div className="table-container">
        <button className="btn-create-user">
          <i className="icon-create">
            <IoIosCreate />
          </i>
          <span className="text-btn">Create User</span>
        </button>
        <div className="table-content">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Date</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>anh 1</td>
                <td>David</td>
                <td>safsd</td>
                <td>Admin</td>
                <td>10-10-2023</td>
                <td>:</td>
              </tr>
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
