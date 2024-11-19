import instance from "../utils/axios";

// api token
export const callRefeshToken = () => {
  return instance.post("/refresh_token");
};

export const fetchAccount = async () => {
  const req = await instance.get("/user/list_all_user");
  return req.data;
};

export const fetchUser = async (idUser) => {
  const response = await instance.get(`/user/${idUser}`);
  return response;
};

// api login
export const callLogin = async (email, password) => {
  const response = await instance.post(`/login`, {
    email: email,
    password: password,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

// api register
export const callRegister = async (email, username, password) => {
  const response = await instance.post(`/register`, {
    username: username,
    email: email,
    password: password,
  });
  return response;
};

// api logout
export const callLogout = (id_user) => {
  return instance.post(`/logout/${id_user}`);
};

// api list category
export const ListAllCategory = async () => {
  const req = await instance.get("/manga/get_all_category");
  return req.data;
};

// api get all manga new
export const ListAllMangaNew = async (page) => {
  const response = await instance.get(
    `/news/new_release_comics/1/manga?page=${page}`
  );
  return response.data;
};
// api get Recommended Comics
export const ListRecommendedComics = async (page) => {
  const response = await instance.get(
    `/recommended_comics/1/manga?page=${page}`
  );
  return response.data;
};

// api get list filter category
export const ListAllMangaFilterCategory = async (category, page) => {
  const response = await instance.get(
    `/manga/list_manga_by_category/1?name_category=${category}&page=${page}`
  );
  return response.data;
};

// api get list rank
// Comming Soon Comics
export const ListCommingSoon = async (page) => {
  const response = await instance.get(
    `/cooming_soon_comics/1/manga?page=${page}`
  );
  return response.data;
};
// week
export const ListRankWeek = async (page) => {
  const response = await instance.get(`/rank_manga_week/1/manga?page=${page}`);
  return response.data;
};
// month
export const ListRankMonth = async (page) => {
  const response = await instance.get(`/rank_manga_month/1/manga?page=${page}`);
  return response.data;
};
// year
export const ListRankYear = async (page) => {
  const response = await instance.get(`/rank_manga_year/1/manga?page=${page}`);
  return response.data;
};

// history read
export const HistoryRead = async (idUser) => {
  const response = await instance.get(
    `http://127.0.0.1:7979/user/activity_history/${idUser}`
  );
  return response;
};
