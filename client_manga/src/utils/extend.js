export const getMangaId = (url) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

export const shortId = (id) => {
  const result = id.split("-");
  return result[result.length - 1];
};

//   format views
export const formatViews = (views) => {
  if (views < 1000) {
    return views;
  } else if (views < 1000000) {
    return (views / 1000).toFixed(1) + "K";
  } else if (views < 1000000000) {
    return (views / 1000000).toFixed(1) + "M";
  } else {
    return (views / 1000000000).toFixed(1) + "B";
  }
};
// remove text
export const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD") // Tách chữ cái và dấu
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .replace(/đ/g, "d") // Chuyển 'đ' thành 'd'
    .replace(/Đ/g, "D") // Chuyển 'Đ' thành 'D'
    .replace(/\s+/g, "") // Loại bỏ khoảng trắng
    .toLowerCase(); // Chuyển toàn bộ chữ thành chữ thường
};
