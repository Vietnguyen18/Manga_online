import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./ModalAccount.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const ModalAccount = (props) => {
  const { handleClose, show } = props;
  const navigate = useNavigate();
  const handleClickLogin = () => {
    handleClose();
    navigate("/login", { state: { action: "login" } });
  };

  const handleClickRegister = () => {
    handleClose();
    navigate("/register", { state: { action: "register" } });
  };
  return (
    <Modal
      className="modal-auth "
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={handleClose}
    >
      <div className="modal-auth-container">
        <Modal.Header closeButton>
          <Modal.Title className="modal-auth-title">Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Hello, please register or log in if you already have an account!
        </Modal.Body>
        <Modal.Footer className="btn-auth">
          <Button
            className="btn-register"
            variant="secondary"
            onClick={handleClickRegister}
          >
            Register
          </Button>
          <Button
            className="btn-login"
            variant="primary"
            onClick={handleClickLogin}
          >
            Login
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ModalAccount;
