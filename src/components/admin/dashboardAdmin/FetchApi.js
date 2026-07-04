import axios from "axios";
import { authHeader } from "../../shop/auth/fetchApi";
const apiURL = process.env.REACT_APP_API_URL;

const getError = (error, fallback) => {
  if (error.response && error.response.data) return error.response.data;
  return { error: fallback };
};

export const DashboardData = async () => {
  try {
    let res = await axios.post(`${apiURL}/api/customize/dashboard-data`, {}, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to load dashboard data");
  }
};

export const getSliderImages = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/customize/get-slide-image`);
    return res.data;
  } catch (error) {
    return getError(error, "Failed to load slider images");
  }
};

export const postUploadImage = async (formData) => {
  try {
    let res = await axios.post(`${apiURL}/api/customize/upload-slide-image`, formData, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to upload image");
  }
};

export const postDeleteImage = async (id) => {
  try {
    let res = await axios.post(`${apiURL}/api/customize/delete-slide-image`, { id }, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to delete image");
  }
};
