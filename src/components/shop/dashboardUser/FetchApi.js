import axios from "axios";
import { authHeader } from "../auth/fetchApi";
const apiURL = process.env.REACT_APP_API_URL;

const getError = (error, fallback) => {
  if (error.response && error.response.data) return error.response.data;
  return { error: fallback };
};

export const getUserById = async (uId) => {
  try {
    let res = await axios.post(`${apiURL}/api/user/signle-user`, { uId }, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to load profile");
  }
};

export const updatePersonalInformationFetch = async (userData) => {
  try {
    let res = await axios.post(`${apiURL}/api/user/edit-user`, userData, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to update profile");
  }
};

export const getOrderByUser = async (uId) => {
  try {
    let res = await axios.post(`${apiURL}/api/order/order-by-user`, { uId }, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to load orders");
  }
};

export const updatePassword = async (formData) => {
  try {
    let res = await axios.post(`${apiURL}/api/user/change-password`, formData, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to update password");
  }
};
