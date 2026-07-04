import axios from "axios";
import { authHeader } from "../auth/fetchApi";
const apiURL = process.env.REACT_APP_API_URL;

const getError = (error, fallback) => {
  if (error.response && error.response.data) return error.response.data;
  return { error: fallback };
};

export const getBrainTreeToken = async () => {
  try {
    let res = await axios.post(`${apiURL}/api/braintree/get-token`, {}, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to load online payment token");
  }
};

export const getPaymentProcess = async (paymentData) => {
  try {
    let res = await axios.post(`${apiURL}/api/braintree/payment`, paymentData, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Payment failed");
  }
};

export const createOrder = async (orderData) => {
  try {
    let res = await axios.post(`${apiURL}/api/order/create-order`, orderData, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Order creation failed");
  }
};
