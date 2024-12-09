import React, { useEffect, useState } from "react";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { DeleteUser, fetchUserByID } from "../../services/api";
import {
  FaBookReader,
  FaCommentAlt,
  FaEdit,
  FaTransgender,
} from "react-icons/fa";
import { list_label_info } from "../../constants/extend";
import avatar from "../../assets/avatar-15-64.png";
import ModalEdit from "./ModalEdit/ModalEdit";
import { message } from "antd";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { doLogoutAction } from "../../redux/account/accountSlice";

const ProfileUser = () => {
  const user = useSelector((state) => state.account.dataUser);
  const [isUser, setIsUser] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [editProfile, setEditProfile] = useState({
    name_user: "",
    date_of_birth: "",
    gender: "",
    job: "",
    avatar_user: "",
    introduction: "",
  });
  console.log(editProfile);

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.id_user) {
        const response = await fetchUserByID(user?.id_user);
        setIsUser(response);
      } else {
        message.error("Account does not exist!");
      }
    };
    fetchUser();
  }, [user?.id_user]);
  // role user
  let role = user.role === "true" || user.role === true ? "Admin" : "Member";

  const handleEditProfile = () => {
    setIsShowModal(!isShowModal);
    setEditProfile({
      name_user: isUser?.name_user,
      date_of_birth: isUser?.date_of_birth,
      gender: isUser?.gender,
      job: isUser?.job,
      avatar_user: isUser?.avatar_user,
      introduction: isUser?.introduction,
    });
  };

  const handleDeleteAccount = (id) => {
    console.log(id);

    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await DeleteUser(id);
        if (response.status === 200) {
          localStorage.removeItem("id_user");
          localStorage.removeItem("role");
          localStorage.removeItem("access_token");
          dispatch(doLogoutAction());
          message.success(response.message);
          navigate("/login");
        } else {
          message.error(response.message);
        }
      }
    });
  };

  return (
    <>
      <div className="profile-container">
        <div className="profile-content">
          <div className="left-content">
            <h2>{user.name}</h2>
            <img src={isUser?.avatar_user || avatar} alt="avatar user" />
            <div className="role-user">
              <span>{role}</span>
            </div>
            <div className="profile-since">
              Member since: {isUser?.participation_time || "N/A"}
            </div>
            <div className="profile-detail">
              <ul>
                <li>
                  <i>
                    <FaBookReader />
                  </i>
                  Reads: {isUser?.number_reads || 0}
                </li>
                <li>
                  <i>
                    <FaCommentAlt />
                  </i>
                  Comments: {isUser?.number_comments || 0}
                </li>
                <li>
                  <i>
                    <FaTransgender />
                  </i>
                  Gender:{" "}
                  {isUser?.gender === "undisclosed"
                    ? "Undisclosed"
                    : isUser?.gender}
                </li>
              </ul>
            </div>
            <div className="btn-active">
              <a href="/" title="Home">
                Back Home
              </a>
              <p onClick={() => handleDeleteAccount(user?.id_user)}>
                Delete Account
              </p>
            </div>
          </div>
          <div className="right-content">
            <div className="profile-header">
              <h3>User Info</h3>
              <span className="btn-editProfile" onClick={handleEditProfile}>
                <i className="icon-edit">
                  <FaEdit />
                </i>
                Edit Profile
              </span>
            </div>
            <div className="profile-user-info">
              {list_label_info.map((e) => (
                <>
                  <div className="profile-user-detail" key={e.id}>
                    <div className="profile-user-label">{e.name}</div>
                    <div
                      className={`profile-user-value ${
                        e.name === "Introduction" ? "scrollable" : ""
                      }`}
                    >
                      {e.name === "FullName"
                        ? isUser?.name_user || "N/A"
                        : e.name === "Email"
                        ? user?.email || "N/A"
                        : e.name === "BirthDate"
                        ? isUser?.date_of_birth || "N/A"
                        : e.name === "Gender"
                        ? isUser?.gender || "N/A"
                        : e.name === "Job"
                        ? isUser?.job || "N/A"
                        : e.name === "Introduction"
                        ? isUser?.introduction || "N/A"
                        : "N/A"}
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isShowModal && (
        <ModalEdit
          showModal={isShowModal}
          setShowModal={setIsShowModal}
          setEditProfile={setEditProfile}
          editProfile={editProfile}
        />
      )}
    </>
  );
};

export default ProfileUser;
