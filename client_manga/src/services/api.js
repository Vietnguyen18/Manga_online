import instance from "../utils/axios";

// api token
export const callRefeshToken = () => {
  return instance.post("/refresh_token");
};

export const fetchAccount = async () => {
  const req = await instance.get("/user/list_all_user");
  return req.data;
};

// api logout
export const callLogout = () => {
  return instance.post("/logout");
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
