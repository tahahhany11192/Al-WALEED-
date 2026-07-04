import axios from "axios";
import { authHeader } from "../../shop/auth/fetchApi";
const apiURL = process.env.REACT_APP_API_URL;

const getError = (error, fallback) => {
  if (error.response && error.response.data) return error.response.data;
  return { error: fallback };
};

export const getAllOrder = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/order/get-all-orders`, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to load orders");
  }
};

export const editCategory = async (oId, status) => {
  let data = { oId: oId, status: status };
  try {
    let res = await axios.post(`${apiURL}/api/order/update-order`, data, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to update order");
  }
};

export const deleteOrder = async (oId) => {
  try {
    let res = await axios.post(`${apiURL}/api/order/delete-order`, { oId }, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to delete order");
  }
};
