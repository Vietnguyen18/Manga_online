import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "../books.scss";
import { message } from "antd";
import { CreateManga } from "../../../../../../services/api";

const ModalCreateManga = ({
  showModal,
  setShowModal,
  setListManga,
  currentPage,
  fetchListManga,
}) => {
  const [newManga, setNewManga] = useState({
    title_manga: "",
    descript_manga: "",
    poster_original: "",
    detail_manga: "",
    categories: "",
    chapters: "",
    status: null,
    author: "",
  });

  console.log("newManga", newManga);
  const [previewPoster, setPreviewPoster] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewManga((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewManga((prev) => ({
        ...prev,
        poster_original: file,
      }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewPoster(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title_manga", newManga.title_manga);
    formData.append("descript_manga", newManga.descript_manga);
    formData.append("detail_manga", newManga.detail_manga);
    formData.append("categories", newManga.categories);
    formData.append("chapters", newManga.chapters);
    formData.append("status", newManga.status);
    formData.append("author", newManga.author);
    if (newManga.poster_original) {
      formData.append("poster_original", newManga.poster_original);
    }

    try {
      const response = await CreateManga(formData);
      console.log(response);

      if (response.status === 200) {
        setListManga((prevList) => {
          if (response.data?.id_manga) {
            return [response.data, ...prevList];
          } else {
            console.error("Missing id_manga in response data:", response.data);
            return prevList;
          }
        });
        await fetchListManga(currentPage);
        message.success(response.message);
        setShowModal(false);
        setNewManga({
          title_manga: "",
          descript_manga: "",
          poster_original: "",
          detail_manga: "",
          categories: "",
          chapters: "",
          status: null,
          author: "",
        });
      } else {
        message.error(response.errMsg);
        console.log("Error: ", response.errCode);
      }
    } catch (error) {
      message.error("Error creating manga", 3);
      console.log("Error: ", error);
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Manga</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title_manga" className="form_create">
              <Form.Label>Name Manga</Form.Label>
              <Form.Control
                type="text"
                name="title_manga"
                value={newManga.title_manga}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="descript_manga" className="form_create">
              <Form.Label>Descript Manga</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="descript_manga"
                value={newManga.descript_manga}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="detail_manga" className="form_create">
              <Form.Label>Detail Manga</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="detail_manga"
                value={newManga.detail_manga}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="categories" className="form_create">
              <Form.Label>Categories</Form.Label>
              <Form.Control
                type="text"
                name="categories"
                value={newManga.categories}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="chapters" className="form_create">
              <Form.Label>Chapters</Form.Label>
              <Form.Control
                type="text"
                name="chapters"
                value={newManga.chapters}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="status" className="form_create">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={newManga.status}
                onChange={handleChange}
                required
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Active">Active</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="author" className="form_create">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={newManga.author}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="poster" className="form_create poster-manga">
              <Form.Label>Poster</Form.Label>
              <div className="poster-preview">
                <p>Preview New Poster:</p>
                {previewPoster && (
                  <img src={previewPoster} alt="Preview Poster" />
                )}
              </div>
              <Form.Control
                type="file"
                name="poster"
                onChange={handleFileChange}
              />
            </Form.Group>

            <div className="btn-modal">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button type="submit" variant="primary" className="ml-2">
                Create Manga
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalCreateManga;
