import axios from "axios";
import { authHeader } from "../../shop/auth/fetchApi";
const apiURL = process.env.REACT_APP_API_URL;

const getError = (error, fallback) => {
  if (error.response && error.response.data) return error.response.data;
  return { error: fallback };
};

export const getAllProduct = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/product/all-product`);
    return res.data;
  } catch (error) {
    return getError(error, "Failed to load products");
  }
};

export const createPorductImage = async ({ pImage }) => {
  let formData = new FormData();
  for (const file of pImage) formData.append("pImage", file);
  return formData;
};

export const createProduct = async ({ pName, pDescription, pImage, pStatus, pCategory, pQuantity, pPrice, pOffer }) => {
  let formData = new FormData();
  for (const file of pImage) formData.append("pImage", file);
  formData.append("pName", pName);
  formData.append("pDescription", pDescription);
  formData.append("pStatus", pStatus);
  formData.append("pCategory", pCategory);
  formData.append("pQuantity", pQuantity);
  formData.append("pPrice", pPrice);
  formData.append("pOffer", pOffer || "");

  try {
    let res = await axios.post(`${apiURL}/api/product/add-product`, formData, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to create product");
  }
};

export const editProduct = async (product) => {
  let formData = new FormData();
  if (product.pEditImages) {
    for (const file of product.pEditImages) formData.append("pEditImages", file);
  }
  formData.append("pId", product.pId);
  formData.append("pName", product.pName);
  formData.append("pDescription", product.pDescription);
  formData.append("pStatus", product.pStatus);
  formData.append("pCategory", product.pCategory._id);
  formData.append("pQuantity", product.pQuantity);
  formData.append("pPrice", product.pPrice);
  formData.append("pOffer", product.pOffer || "");
  formData.append("pImages", product.pImages);

  try {
    let res = await axios.post(`${apiURL}/api/product/edit-product`, formData, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to edit product");
  }
};

export const deleteProduct = async (pId) => {
  try {
    let res = await axios.post(`${apiURL}/api/product/delete-product`, { pId }, authHeader());
    return res.data;
  } catch (error) {
    return getError(error, "Failed to delete product");
  }
};

export const productByCategory = async (catId) => {
  try {
    let res = await axios.post(`${apiURL}/api/product/product-by-category`, { catId });
    return res.data;
  } catch (error) {
    return getError(error, "Failed to filter products");
  }
};

export const productByPrice = async (price) => {
  try {
    let res = await axios.post(`${apiURL}/api/product/product-by-price`, { price });
    return res.data;
  } catch (error) {
    return getError(error, "Failed to filter products");
  }
};
