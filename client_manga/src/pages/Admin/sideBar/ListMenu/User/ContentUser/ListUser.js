import React, { useEffect, useState } from "react";
import { message, Pagination } from "antd";
import "../user.scss";
import { IoIosCreate } from "react-icons/io";
import { DeleteUser, fetchAccount } from "../../../../../../services/api";
import { HiDotsVertical } from "react-icons/hi";
import ModalEdit from "./ModalEdit";
import ModalCreateUser from "./ModalCreateUser";

const ListUser = ({ search }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isTotalPage, setIsTotalPage] = useState(0);
  const [listUsers, setListUsers] = useState([]);
  const [isShowModelEdit, setIsShowModelEdit] = useState(false);
  const [isShowModelCreate, setIsShowModelCreate] = useState(false);
  console.log("ishow", isShowModelCreate);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const [editedUser, setEditedUser] = useState({
    name_user: "",
    email: "",
    role: "Member",
  });

  useEffect(() => {
    fetchListUsers(currentPage, search);
  }, [currentPage, search]);

  const fetchListUsers = async (page) => {
    const response = await fetchAccount(page, search);
    setListUsers(response.list_all_user);
    setIsTotalPage(response.total_page);
  };

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };
  const handleShowModalActive = (id_user) => {
    if (selectedUserId === id_user) {
      setSelectedUserId(null);
    } else {
      setSelectedUserId(id_user);
    }
  };
  const handelShowModal = (id_user) => {
    setIsShowModelEdit(true);
    const userToEdit = listUsers.find((user) => user.id_user === id_user);
    setIdUser(userToEdit.id_user);
    setEditedUser({
      name_user: userToEdit.name_user,
      email: userToEdit.email,
      role: userToEdit.role === "true" ? "Admin" : "Member",
    });
  };
  const handleSubmit = () => {
    setIsShowModelEdit(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteUser = async (id_user) => {
    try {
      const response = await DeleteUser(id_user);

      if (response.status === 200) {
        fetchListUsers(currentPage);
        message.success(response.message);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("There was an error deleting the user. Please try again.");
      console.error(error);
    }
  };

  const handelCreateUser = () => {
    setIsShowModelCreate(true);
  };

  return (
    <div className="content-user">
      <div className="table-container">
        <button className="btn-create-user">
          <i className="icon-create">
            <IoIosCreate />
          </i>
          <span className="text-btn" onClick={handelCreateUser}>
            Create User
          </span>
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
              {listUsers.map((e, index) => {
                if (!e) return null;
                let role =
                  e.role === "true" || e.role === true ? "Admin" : "Member";

                return (
                  <tr key={e.id_user}>
                    <td>{e.id_user}</td>
                    <td>
                      <img
                        src={e.avatar_user}
                        alt="avatar user"
                        className="avatar_user"
                      />
                    </td>
                    <td>{e.name_user}</td>
                    <td>{e.email}</td>
                    <td>{role}</td>
                    <td>{e.participation_time}</td>
                    <td>
                      <i
                        className="icon_active"
                        onClick={() => handleShowModalActive(e.id_user)}
                      >
                        <HiDotsVertical />
                      </i>
                      {selectedUserId === e.id_user && (
                        <div className="content_active">
                          <p onClick={() => handelShowModal(e.id_user)}>Edit</p>
                          <p onClick={() => handleDeleteUser(e.id_user)}>
                            Delete
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {isShowModelEdit && (
          <ModalEdit
            showModal={isShowModelEdit}
            setShowModal={setIsShowModelEdit}
            handleSubmit={handleSubmit}
            editedUser={editedUser}
            handleChange={handleChange}
            idUser={idUser}
            setListUsers={setListUsers}
          />
        )}
        {isShowModelCreate && (
          <ModalCreateUser
            showModal={isShowModelCreate}
            setShowModal={setIsShowModelCreate}
            fetchListUsers={fetchListUsers}
            currentPage={currentPage}
            setListUsers={setListUsers}
          />
        )}
        {/* Button */}
        <div className="pagination-user">
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

export default ListUser;
