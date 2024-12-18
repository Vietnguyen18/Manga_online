export const getMangaIdgetShortenedUrl = (url) => {
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

export const makeLink = (type, id) => {
  const localhost = `${window.location.protocol}//${window.location.host}`;
  if (!type || !id) {
    throw new Error("Missing required parameters: type, or id.");
  }

  return `${localhost}/${type}/${id}`;
};

export const makeLinkChapter = (type, namePath, id) => {
  const localhost = `${window.location.protocol}//${window.location.host}`;
  if (!type || !id || !namePath) {
    throw new Error("Missing required parameters: type, or id , or namePath.");
  }

  return `${localhost}/${type}/${namePath}/${id}`;
};

export const makeTitle = (text) => {
  if (!text) {
    throw new Error("Text is required.");
  }

  const normalizedText = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return normalizedText.replace(/\s+/g, "-");
};

export const changeidManga = (name) => {
  const newCode = name.split("-").pop();
  // return `manga-${newCode}`;
  return newCode;
};

// format rate
export const formatRating = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const stars = Array(fullStars).fill("★");
  if (hasHalfStar) {
    stars.push("☆");
  }
  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push("☆");
  }
  return stars.join(" ");
};

//formatTimeDifference

export const formatTimeDifference = (dateToCompare) => {
  const timeUnits = ["seconds", "minute", "hour", "year"];
  if (timeUnits.some((unit) => dateToCompare.toLowerCase().includes(unit))) {
    return dateToCompare;
  }

  const now = new Date();
  let formattedDate;

  // Xử lý các định dạng khác nhau
  if (dateToCompare.includes("GMT") || dateToCompare.includes(",")) {
    formattedDate = new Date(dateToCompare);
  } else if (dateToCompare.match(/\d{2}:\d{2}:\d{2} \d{2}-\d{2}-\d{4}/)) {
    const [time, date] = dateToCompare.split(" ");
    const [day, month, year] = date.split("-");
    const fullDate = `${year}-${month}-${day}T${time}`;
    formattedDate = new Date(fullDate);
  } else {
    formattedDate = new Date(dateToCompare);
  }

  const diffInMilliseconds = now - formattedDate;
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths =
    now.getMonth() -
    formattedDate.getMonth() +
    (now.getFullYear() - formattedDate.getFullYear()) * 12;
  const diffInYears = now.getFullYear() - formattedDate.getFullYear();

  // Trả về kết quả
  if (diffInSeconds < 60) {
    return `${diffInSeconds} giây trước`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  } else if (diffInDays < 30) {
    return `${diffInDays} ngày trước`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  } else {
    return `${diffInYears} năm trước`;
  }
};

// format text rank
export const formatText = (input) => {
  const map = {
    "top-week": "Top Week",
    "upcoming-releases": "Upcoming Releases",
    "top-month": "Top Month",
    "top-year": "Top Year",
  };

  return map[input] || input;
};
