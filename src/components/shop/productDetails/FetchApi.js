import axios from "axios";
import { authHeader } from "../auth/fetchApi";
const apiURL = process.env.REACT_APP_API_URL;

const getError = (error, fallback) => {
  if (error.response && error.response.data) return error.response.data;
  return { error: fallback };
};

export const getSingleProduct = async (pId) => {
  try {
    let res = await axios.post(`${apiURL}/api/product/single-product`, { pId });
    return res.data;
  } catch (error) {
    return getError(error, "Failed to load product");
  }
};

export const postAddReview = async (formData) => {
  try {
    let res = await axios.post(`${apiURL}/api/product/add-review`, formData, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to add review");
  }
};

export const postDeleteReview = async (formData) => {
  try {
    let res = await axios.post(`${apiURL}/api/product/delete-review`, formData, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to delete review");
  }
};
