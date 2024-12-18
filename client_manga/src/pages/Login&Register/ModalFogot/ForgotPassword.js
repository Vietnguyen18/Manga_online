import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FetchForgotPassword } from "../../../services/api";
import { message } from "antd";

const ForgotPassword = ({ show, setShowModal }) => {
  const [newPassword, setNewPassword] = useState({
    email: "",
    new_password: "",
    confirm_password: "",
  });
  const [isLoading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("name:", name, "value:", value);

    setNewPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.new_password !== newPassword.confirm_password) {
      message.error("Passwords do not match");
      return;
    }
    const formData = new FormData();
    formData.append("email", newPassword.email);
    formData.append("new_password", newPassword.new_password);
    formData.append("confirm_password", newPassword.confirm_password);
    setLoading(true);
    try {
      const response = await FetchForgotPassword(formData);
      console.log("res", response);
      if (response.status === 200) {
        message.success(response.message);
        setNewPassword({
          email: "",
          new_password: "",
          confirm_password: "",
        });
        setShowModal(false);
        setLoading(false);
      } else {
        message.error(response.message || "Error");
        setLoading(false);
      }
    } catch (error) {
      message.error("Error creating manga");
      console.log("Error: ", error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                value={newPassword.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="new_password"
                placeholder="New password"
                value={newPassword.new_password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirm_password"
                placeholder="Confirm new password"
                value={newPassword.confirm_password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              {isLoading ? "Reset Password....." : "Reset Password"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ForgotPassword;
