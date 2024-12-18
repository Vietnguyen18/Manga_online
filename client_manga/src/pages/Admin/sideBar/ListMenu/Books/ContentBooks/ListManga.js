import React, { useEffect, useState } from "react";
import { message, Pagination } from "antd";
import "../books.scss";
import { IoIosCreate } from "react-icons/io";
import { HiDotsVertical } from "react-icons/hi";
import ModalEdit from "./ModalEdit";
import ModalCreateManga from "./ModalCreateManga";
import {
  DeleteManga,
  FilterManga,
  GetChaptersByID,
} from "../../../../../../services/api";
import {
  formatViews,
  getMangaIdgetShortenedUrl,
  shortId,
} from "../../../../../../utils/extend";
import Swal from "sweetalert2";

const ListManga = ({ search }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isTotalPage, setIsTotalPage] = useState(0);
  const [listManga, setListManga] = useState([]);

  const [isShowModelEdit, setIsShowModelEdit] = useState(false);

  const [isShowModelCreate, setIsShowModelCreate] = useState(false);

  const [selectedID, setSelectedID] = useState(null);

  const [idManga, setIdManga] = useState(null);
  const [editedManga, setEditedManga] = useState({
    name_manga: "",
    poster: "",
    categories: "",
    author: "",
  });

  const page = currentPage;
  useEffect(() => {
    fetchListManga(currentPage, search);
  }, [currentPage, search]);

  const fetchListManga = async (page) => {
    const response = await FilterManga(search, page);
    setListManga(response.data);
    setIsTotalPage(response.total_page);
  };

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowModalActive = (id_manga) => {
    setSelectedID(selectedID === id_manga ? null : id_manga);
  };
  const handelShowModal = (id_manga) => {
    setIsShowModelEdit(true);
    const mangaToEdit = listManga.find(
      (manga) => getMangaIdgetShortenedUrl(manga.id_manga) === id_manga
    );

    setIdManga(id_manga);
    setEditedManga({
      name_manga: mangaToEdit.title,
      poster: mangaToEdit.poster,
      categories: mangaToEdit.categories,
      author: mangaToEdit.author,
    });
  };
  const handleSubmit = () => {
    setIsShowModelEdit(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedManga((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handelCreateUser = () => {
    setIsShowModelCreate(true);
  };

  const handleDeleteManga = async (id_manga) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to restore this comic!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        try {
          const response = await GetChaptersByID(id_manga);

          if (response && response.data) {
            const listChapter = response.data;

            if (listChapter.length > 0) {
              const deletePromises = listChapter.map((item) =>
                DeleteManga(id_manga, item.path_segment_chapter)
              );
              const results = await Promise.all(deletePromises);
              results.forEach((res, index) => {
                if (res.status === 200) {
                  message.success(
                    `Chapter ${listChapter[index].path_segment_chapter} deleted successfully.`,
                    3
                  );
                } else {
                  message.error(
                    `Failed to delete chapter ${listChapter[index].path_segment_chapter}.`,
                    3
                  );
                }
              });
            }

            const mangaDeletionResult = await DeleteManga(id_manga, null);
            if (mangaDeletionResult.status === 200) {
              message.success("Manga deleted successfully.", 3);
            } else {
              message.error("Failed to delete manga.", 3);
            }

            await fetchListManga(currentPage);
          } else {
            const mangaDeletionResult = await DeleteManga(id_manga, null);
            if (mangaDeletionResult.status === 200) {
              message.success("Manga deleted successfully.", 3);
            } else {
              message.error("Failed to delete manga.", 3);
            }

            await fetchListManga(currentPage);
          }
        } catch (error) {
          message.error("Error occurred while deleting manga.", 3);
        }
      }
    });
  };

  return (
    <div className="content_list_manga">
      <div className="table-container">
        <button className="btn-create-user">
          <i className="icon-create">
            <IoIosCreate />
          </i>
          <span className="text-btn" onClick={handelCreateUser}>
            Create Manga
          </span>
        </button>
        <div className="table-content">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Poster</th>
                <th>Name Manga</th>
                <th>Author</th>
                <th>Genres</th>
                <th>Category</th>
                <th>Rate</th>
                <th>views</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {listManga.map((e, index) => (
                <tr key={getMangaIdgetShortenedUrl(e.id_manga)}>
                  <td>{getMangaIdgetShortenedUrl(shortId(e.id_manga))}</td>
                  <td>
                    <img
                      src={e.poster}
                      alt={e.title}
                      style={{ width: "50px" }}
                    />
                  </td>
                  <td>{e.title}</td>
                  <td>{e.author}</td>
                  <td>{e.genres}</td>
                  <td>
                    {e.categories.length > 10
                      ? `${e.categories.substring(0, 10)}.....`
                      : e.categories}
                  </td>
                  <td>{e.rate}</td>
                  <td>{formatViews(e.views)}</td>
                  <td>
                    <i
                      className="icon_active"
                      onClick={() =>
                        handleShowModalActive(
                          getMangaIdgetShortenedUrl(e.id_manga)
                        )
                      }
                    >
                      <HiDotsVertical />
                    </i>
                    {selectedID === getMangaIdgetShortenedUrl(e.id_manga) && (
                      <div className="content_active">
                        <p
                          onClick={() =>
                            handelShowModal(
                              getMangaIdgetShortenedUrl(e.id_manga)
                            )
                          }
                        >
                          Edit
                        </p>
                        <p
                          onClick={() =>
                            handleDeleteManga(
                              getMangaIdgetShortenedUrl(e.id_manga)
                            )
                          }
                        >
                          Delete
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isShowModelEdit && (
          <ModalEdit
            showModal={isShowModelEdit}
            setShowModal={setIsShowModelEdit}
            handleSubmit={handleSubmit}
            editedManga={editedManga}
            handleChange={handleChange}
            idManga={idManga}
            setListManga={setListManga}
            setEditedManga={setEditedManga}
            fetchListManga={fetchListManga}
            currentPage={currentPage}
          />
        )}
        {isShowModelCreate && (
          <ModalCreateManga
            showModal={isShowModelCreate}
            setShowModal={setIsShowModelCreate}
            fetchListManga={fetchListManga}
            currentPage={currentPage}
            setListManga={setListManga}
          />
        )}
        {/* Button */}
        <div className="pagination-manga">
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

export default ListManga;
