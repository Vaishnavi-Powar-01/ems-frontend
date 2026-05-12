const API_URL = import.meta.env.VITE_API_URL || "";

// Remove /api from end
export const IMAGE_BASE_URL = API_URL.replace(/\/api\/?$/, "");

export const getImageUrl = (folder, filename) => {
  if (!filename) return null;

  // already full URL
  if (filename.startsWith("http")) {
    return filename;
  }

  return `${IMAGE_BASE_URL}/uploads/${folder}/${filename}`;
};