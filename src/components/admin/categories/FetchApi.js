import axios from "axios";
import { authHeader } from "../../shop/auth/fetchApi";
const apiURL = process.env.REACT_APP_API_URL;

const getError = (error, fallback) => {
  if (error.response && error.response.data) return error.response.data;
  return { error: fallback };
};

export const getAllCategory = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/category/all-category`);
    return res.data;
  } catch (error) {
    return getError(error, "Failed to load categories");
  }
};

export const createCategory = async ({ cName, cImage, cDescription, cStatus }) => {
  let formData = new FormData();
  formData.append("cImage", cImage);
  formData.append("cName", cName);
  formData.append("cDescription", cDescription);
  formData.append("cStatus", cStatus);

  try {
    let res = await axios.post(`${apiURL}/api/category/add-category`, formData, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to create category");
  }
};

export const editCategory = async (cId, des, status) => {
  let data = { cId: cId, cDescription: des, cStatus: status };
  try {
    let res = await axios.post(`${apiURL}/api/category/edit-category`, data, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to edit category");
  }
};

export const deleteCategory = async (cId) => {
  try {
    let res = await axios.post(`${apiURL}/api/category/delete-category`, { cId }, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to delete category");
  }
};
