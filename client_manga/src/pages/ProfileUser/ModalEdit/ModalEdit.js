import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ChangeProfile } from "../../../services/api";
import { message } from "antd";
import "./ModalEditProfile.scss";

const ModalEdit = ({
  setShowModal,
  showModal,
  setEditProfile,
  editProfile,
}) => {
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const idUser = localStorage.getItem("id_user");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(false);
    const formData = new FormData();
    formData.append("name_user", editProfile.name_user);
    formData.append("date_of_birth", editProfile.date_of_birth);
    formData.append("gender", editProfile.gender);
    formData.append("job", editProfile.job);
    formData.append("introduction", editProfile.introduction);
    if (newAvatar) {
      formData.append("avatar_user", newAvatar);
    }
    try {
      const response = await ChangeProfile(idUser, formData);
      if (response.status === 200) {
        message.success("Profile updated successfully!");
      } else {
        message.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setShowModal(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(file); // Chỉ lưu ảnh mới vào state riêng
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewAvatar(event.target.result); // Hiển thị ảnh xem trước
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Name */}
            <Form.Group controlId="name_user" className="form-edit">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name_user"
                value={editProfile.name_user}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Date of Birth */}
            <Form.Group controlId="date_of_birth" className="form-edit">
              <Form.Label>Date Of Birth</Form.Label>
              <Form.Control
                type="date"
                name="date_of_birth"
                value={editProfile.date_of_birth}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Gender */}
            <Form.Group controlId="gender" className="form-edit">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={editProfile.gender}
                onChange={handleChange}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="undisclosed">Undisclosed</option>
              </Form.Control>
            </Form.Group>

            {/* Job */}
            <Form.Group controlId="job" className="form-edit">
              <Form.Label>Job</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="job"
                value={editProfile.job}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Introduction */}
            <Form.Group controlId="introduction" className="form-edit">
              <Form.Label>Introduction</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="introduction"
                value={editProfile.introduction}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* avatar */}
            <Form.Group controlId="avatar" className="form_edit avatar-profile">
              <Form.Label>Avatar</Form.Label>
              <div className="avatar-preview">
                <p>Original Avatar:</p>
                {editProfile.avatar_user && (
                  <img src={editProfile.avatar_user} alt="Original Avatar" />
                )}
                <p>Preview New Avatar:</p>
                {previewAvatar && (
                  <img src={previewAvatar} alt="Preview Avatar" />
                )}
              </div>
              <Form.Control
                type="file"
                name="Avatar"
                onChange={handleAvatarChange}
              />
            </Form.Group>

            {/* Buttons */}
            <div className="btn-modal">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button type="submit" variant="primary" className="ml-2">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalEdit;
