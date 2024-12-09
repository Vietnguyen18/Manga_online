import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "../user.scss";
import { EditUser } from "../../../../../../services/api";
import { message } from "antd";

const ModalEdit = ({
  idUser,
  showModal,
  setShowModal,
  editedUser,
  handleChange,
  setListUsers,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await EditUser(
        idUser,
        editedUser.name_user,
        editedUser.email,
        editedUser.role
      );
      if (response.status === 200) {
        setListUsers((prevList) =>
          prevList.map((user) =>
            user.id_user === idUser ? { ...user, ...editedUser } : user
          )
        );
        message.success(response.message, 3);
        setShowModal(false);
      } else {
        message.error(response.errMsg);
        console.log("Error: ", response.errCode);
      }
    } catch (error) {
      message.error("Error updating user:", 3);
    }
  };
  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name_user" className="form-edit">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name_user"
                value={editedUser.name_user}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="email" className="form-edit">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editedUser.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="role" className="form-edit">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={editedUser.role}
                onChange={handleChange}
                required
              >
                <option value="Admin">Admin</option>
                <option value="Member">Member</option>
              </Form.Control>
            </Form.Group>

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
