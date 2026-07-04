import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const isAuthenticate = () => {
  try {
    return localStorage.getItem("jwt") ? JSON.parse(localStorage.getItem("jwt")) : false;
  } catch (error) {
    localStorage.removeItem("jwt");
    return false;
  }
};

export const isAdmin = () => {
  const auth = isAuthenticate();
  return auth && auth.user && auth.user.role === 1;
};

export const authHeader = () => {
  const auth = isAuthenticate();
  return {
    headers: {
      token: auth && auth.token ? `Bearer ${auth.token}` : "",
      Authorization: auth && auth.token ? `Bearer ${auth.token}` : "",
    },
  };
};

const getError = (error, fallback) => {
  if (error.response && error.response.data) return error.response.data;
  return { error: fallback };
};

export const loginReq = async ({ email, password }) => {
  try {
    let res = await axios.post(`${apiURL}/api/signin`, { email, password });
    return res.data;
  } catch (error) {
    return getError(error, "Login failed");
  }
};

export const signupReq = async ({ name, email, password, cPassword }) => {
  try {
    let res = await axios.post(`${apiURL}/api/signup`, { name, email, password, cPassword });
    return res.data;
  } catch (error) {
    return getError(error, "Signup failed");
  }
};
