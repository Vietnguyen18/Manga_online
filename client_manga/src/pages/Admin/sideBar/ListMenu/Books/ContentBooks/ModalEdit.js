import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "../books.scss";
import { EditManga, ListAllCategory } from "../../../../../../services/api";
import { message } from "antd";

const ModalEdit = ({
  idManga,
  showModal,
  setShowModal,
  editedManga,
  handleChange,
  setListManga,
  fetchListManga,
  currentPage,
}) => {
  const [dataList, setDataList] = useState([]);
  const [previewPoster, setPreviewPoster] = useState(null);
  const [newPoster, setNewPoster] = useState(null);

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPoster(file); // Chỉ lưu ảnh mới vào state riêng
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewPoster(event.target.result); // Hiển thị ảnh xem trước
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !editedManga.name_manga ||
      !editedManga.author ||
      !editedManga.categories
    ) {
      message.error("All fields are required", 3);
      return;
    }

    const formData = new FormData();
    formData.append("title_manga", editedManga.name_manga);
    formData.append("author", editedManga.author);
    formData.append("categories", editedManga.categories);
    if (newPoster) {
      formData.append("poster_original", newPoster);
    }

    try {
      const response = await EditManga(idManga, formData);

      if (response.status === 200) {
        setListManga((prevList) =>
          prevList.map((manga) =>
            manga.path_segment_manga == idManga
              ? {
                  ...manga,
                  ...editedManga,
                  poster_original: newPoster
                    ? previewPoster
                    : editedManga.poster,
                }
              : manga
          )
        );
        await fetchListManga(currentPage);
        message.success(response.message, 3);
        setShowModal(false);
      } else {
        message.error(response.errMsg || "Failed to update manga");
        console.error("Error:", response.errCode);
      }
    } catch (error) {
      message.error("Error updating manga", 3);
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchDataList = async () => {
      try {
        const response = await ListAllCategory();
        setDataList(response);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        message.error("Failed to load categories", 3);
      }
    };
    fetchDataList();
  }, []);

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Manga</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name_manga" className="form-edit">
              <Form.Label>Name Manga</Form.Label>
              <Form.Control
                type="text"
                name="name_manga"
                value={editedManga.name_manga}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="author" className="form-edit">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={editedManga.author}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="category" className="form-edit">
              <Form.Label>Categories</Form.Label>
              <Form.Control
                as="select"
                name="genres"
                value={editedManga.categories}
                onChange={handleChange}
                required
              >
                {dataList &&
                  dataList.map((e, index) => (
                    <option value={e.category_name} key={index}>
                      {e.category_name}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="poster" className="form_edit poster">
              <Form.Label>Poster</Form.Label>
              <div className="poster-preview">
                <p>Original Poster:</p>
                {editedManga.poster && (
                  <img src={editedManga.poster} alt="Original Poster" />
                )}
                <p>Preview New Poster:</p>
                {previewPoster && (
                  <img src={previewPoster} alt="Preview Poster" />
                )}
              </div>
              <Form.Control
                type="file"
                name="poster"
                onChange={handlePosterChange}
              />
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
