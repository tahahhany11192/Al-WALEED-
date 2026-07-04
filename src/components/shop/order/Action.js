import { createOrder } from "./FetchApi";

const getCurrentUserId = () => JSON.parse(localStorage.getItem("jwt")).user._id;

const resetCheckout = (dispatch, setState, history) => {
  localStorage.setItem("cart", JSON.stringify([]));
  dispatch({ type: "cartProduct", payload: null });
  dispatch({ type: "cartTotalCost", payload: null });
  dispatch({ type: "orderSuccess", payload: true });
  setState((prevState) => ({ ...prevState, processing: false, clientToken: "", instance: {} }));
  dispatch({ type: "loading", payload: false });
  return history.push("/");
};

const validateCheckout = (state, setState) => {
  if (!state.address.trim()) {
    setState({ ...state, error: "Please provide your delivery address" });
    return false;
  }
  if (!state.phone.trim()) {
    setState({ ...state, error: "Please provide your phone number" });
    return false;
  }
  if (!state.location.trim()) {
    setState({ ...state, error: "Please provide your location" });
    return false;
  }
  return true;
};

const buildOrderData = (state, totalCost, extra = {}) => ({
  allProduct: JSON.parse(localStorage.getItem("cart")) || [],
  user: getCurrentUserId(),
  amount: totalCost(),
  address: state.address,
  phone: state.phone,
  location: state.location,
  paymentMethod: state.paymentMethod,
  ...extra,
});

export const fetchData = async (cartListProduct, dispatch) => {
  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await cartListProduct();
    if (responseData && responseData.Products) {
      setTimeout(function () {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "loading", payload: false });
      }, 500);
    } else {
      dispatch({ type: "loading", payload: false });
    }
  } catch (error) {
    dispatch({ type: "loading", payload: false });
    console.log(error);
  }
};

export const fetchbrainTree = async (getBrainTreeToken, setState) => {
  try {
    let responseData = await getBrainTreeToken();
    if (responseData && responseData.clientToken) {
      setState((prevState) => ({
        ...prevState,
        clientToken: responseData.clientToken,
        success: responseData.success,
      }));
    } else {
      setState((prevState) => ({ ...prevState, clientToken: false }));
    }
  } catch (error) {
    setState((prevState) => ({ ...prevState, clientToken: false }));
  }
};

export const placeCodOrder = async (data, dispatch, state, setState, totalCost, history) => {
  if (!validateCheckout(state, setState)) return;

  dispatch({ type: "loading", payload: true });
  setState({ ...state, processing: true, error: false });

  const orderData = buildOrderData(state, totalCost, {
    paymentMethod: "COD",
    paymentStatus: "Pending",
    transactionId: `COD-${Date.now()}`,
  });

  const responseData = await createOrder(orderData);
  if (responseData && responseData.success) {
    return resetCheckout(dispatch, setState, history);
  }

  dispatch({ type: "loading", payload: false });
  setState({ ...state, processing: false, error: responseData.error || responseData.message || "Order creation failed" });
};

export const pay = async (data, dispatch, state, setState, getPaymentProcess, totalCost, history) => {
  if (!validateCheckout(state, setState)) return;

  if (!state.instance || !state.instance.requestPaymentMethod) {
    setState({ ...state, error: "Online payment is not ready. Please use Cash on Delivery or try again." });
    return;
  }

  try {
    const paymentMethodData = await state.instance.requestPaymentMethod();
    dispatch({ type: "loading", payload: true });
    setState({ ...state, processing: true, error: false });

    const paymentData = {
      amountTotal: totalCost(),
      paymentMethod: paymentMethodData.nonce,
    };

    const paymentResponse = await getPaymentProcess(paymentData);
    if (paymentResponse && paymentResponse.transaction) {
      const orderData = buildOrderData(state, totalCost, {
        paymentMethod: "Online",
        paymentStatus: "Paid",
        amount: paymentResponse.transaction.amount,
        transactionId: paymentResponse.transaction.id,
      });

      const responseData = await createOrder(orderData);
      if (responseData && responseData.success) {
        return resetCheckout(dispatch, setState, history);
      }
      throw new Error(responseData.error || responseData.message || "Order creation failed");
    }

    throw new Error(paymentResponse.error || "Payment failed");
  } catch (error) {
    dispatch({ type: "loading", payload: false });
    setState({ ...state, processing: false, error: error.message });
  }
};
