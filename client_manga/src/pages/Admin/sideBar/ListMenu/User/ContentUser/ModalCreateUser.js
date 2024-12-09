import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "../user.scss";
import { message } from "antd";
import { CreateUser } from "../../../../../../services/api";

const ModalCreateUser = ({
  showModal,
  setShowModal,
  fetchListUsers,
  currentPage,
  setListUsers,
}) => {
  const [newUser, setNewUser] = useState({
    name_user: "",
    email: "",
    date_of_birth: "",
    gender: "Male",
    job: "",
    role: "Member",
    avatar_user: null,
    introduction: "",
  });
  console.log("newUser", newUser);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewUser((prev) => ({
        ...prev,
        avatar_user: file,
      }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewAvatar(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name_user", newUser.name_user);
    formData.append("email", newUser.email);
    formData.append("date_of_birth", newUser.date_of_birth);
    formData.append("gender", newUser.gender);
    formData.append("job", newUser.job);
    formData.append("role", newUser.role);
    if (newUser.avatar_user) {
      formData.append("avatar_user", newUser.avatar_user);
    }
    formData.append("introduction", newUser.introduction);

    try {
      const response = await CreateUser(formData);
      console.log(response);

      if (response.status === 200) {
        setListUsers((prevList) => [response.data, ...prevList]);
        message.success(response.message, 3);
        fetchListUsers(currentPage);
        setShowModal(false);
        setNewUser({
          name_user: "",
          email: "",
          date_of_birth: "",
          gender: "Male",
          job: "",
          role: "Member",
          avatar_user: null,
          introduction: "",
        });
      } else {
        message.error(response.errMsg);
        console.log("Error: ", response.errCode);
      }
    } catch (error) {
      message.error("Error creating user", 3);
      console.log("loi ne", error);
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name_user" className="form_create">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name_user"
                value={newUser.name_user}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="email" className="form_create">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="date_of_birth" className="form_create">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="date_of_birth"
                value={newUser.date_of_birth}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="gender" className="form_create">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={newUser.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="job" className="form_create">
              <Form.Label>Job</Form.Label>
              <Form.Control
                type="text"
                name="job"
                value={newUser.job}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="role" className="form_create">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={newUser.role}
                onChange={handleChange}
              >
                <option value="Admin">Admin</option>
                <option value="Member">Member</option>
              </Form.Control>
            </Form.Group>

            <Form.Group
              controlId="avatar_user"
              className="form_create avatar-user"
            >
              <Form.Label>Avatar</Form.Label>
              <div className="avatar-preview">
                <p>Preview New Avatar:</p>
                {previewAvatar && (
                  <img src={previewAvatar} alt="Preview avatar" />
                )}
              </div>
              <Form.Control
                type="file"
                name="avatar_user"
                onChange={handleFileChange}
              />
            </Form.Group>

            <Form.Group controlId="introduction" className="form_create">
              <Form.Label>Introduction</Form.Label>
              <Form.Control
                as="textarea"
                name="introduction"
                value={newUser.introduction}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="btn-modal">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button type="submit" variant="primary" className="ml-2">
                Create User
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalCreateUser;
