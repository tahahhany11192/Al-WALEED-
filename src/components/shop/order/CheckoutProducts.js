import React, { Fragment, useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../layout";
import { subTotal, quantity, totalCost } from "../partials/Mixins";

import { cartListProduct } from "../partials/FetchApi";
import { getBrainTreeToken, getPaymentProcess } from "./FetchApi";
import { fetchData, fetchbrainTree, pay, placeCodOrder } from "./Action";

import DropIn from "braintree-web-drop-in-react";

const apiURL = process.env.REACT_APP_API_URL;

export const CheckoutComponent = () => {
  const history = useHistory();
  const { data, dispatch } = useContext(LayoutContext);

  const [state, setState] = useState({
    address: "",
    phone: "",
    location: "",
    paymentMethod: "COD",
    error: false,
    success: false,
    clientToken: null,
    instance: {},
    processing: false,
  });

  useEffect(() => {
    fetchData(cartListProduct, dispatch);
    fetchbrainTree(getBrainTreeToken, setState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg className="w-12 h-12 animate-spin text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        <span className="ml-3">Please wait until finish</span>
      </div>
    );
  }

  return (
    <Fragment>
      <section className="mx-4 mt-24 md:mx-12 md:mt-32 lg:mt-28 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="text-sm uppercase tracking-widest text-gray-500">Checkout</div>
            <div className="text-3xl font-semibold text-gray-900">Complete your order</div>
            <p className="text-gray-600 mt-2">Add your delivery details and choose Cash on Delivery or online payment.</p>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <div className="lg:w-5/12 mb-6 lg:mb-0">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-6">
                <div className="text-xl font-semibold mb-4">Order summary</div>
                <CheckoutProducts products={data.cartProduct} />
                <div className="border-t mt-4 pt-4 flex items-center justify-between text-xl font-semibold">
                  <span>Total</span>
                  <span>${totalCost()}.00</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-7/12">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-8">
                {state.error ? <div className="bg-red-100 text-red-700 py-3 px-4 rounded mb-4">{state.error}</div> : ""}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col md:col-span-2">
                    <label htmlFor="address" className="pb-2 font-medium text-gray-700">Delivery address</label>
                    <input
                      value={state.address}
                      onChange={(e) => setState({ ...state, address: e.target.value, error: false })}
                      type="text"
                      id="address"
                      className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-gray-900"
                      placeholder="Building, street, apartment..."
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="phone" className="pb-2 font-medium text-gray-700">Phone number</label>
                    <input
                      value={state.phone}
                      onChange={(e) => setState({ ...state, phone: e.target.value, error: false })}
                      type="tel"
                      id="phone"
                      className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-gray-900"
                      placeholder="+20..."
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="location" className="pb-2 font-medium text-gray-700">Location</label>
                    <input
                      value={state.location}
                      onChange={(e) => setState({ ...state, location: e.target.value, error: false })}
                      type="text"
                      id="location"
                      className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-gray-900"
                      placeholder="City / area / map link"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="font-medium text-gray-700 mb-3">Payment method</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className={`border rounded-lg p-4 cursor-pointer ${state.paymentMethod === "COD" ? "border-gray-900 bg-gray-100" : "border-gray-300"}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={state.paymentMethod === "COD"}
                        onChange={() => setState({ ...state, paymentMethod: "COD", error: false })}
                        className="mr-2"
                      />
                      <span className="font-semibold">Cash on Delivery</span>
                      <p className="text-sm text-gray-600 mt-1">Customer pays when the order arrives.</p>
                    </label>

                    <label className={`border rounded-lg p-4 cursor-pointer ${state.paymentMethod === "Online" ? "border-gray-900 bg-gray-100" : "border-gray-300"}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Online"
                        checked={state.paymentMethod === "Online"}
                        onChange={() => setState({ ...state, paymentMethod: "Online", error: false })}
                        className="mr-2"
                      />
                      <span className="font-semibold">Online payment</span>
                      <p className="text-sm text-gray-600 mt-1">Card / PayPal using Braintree sandbox.</p>
                    </label>
                  </div>
                </div>

                {state.paymentMethod === "Online" ? (
                  <div className="mt-6">
                    {state.clientToken ? (
                      <DropIn
                        options={{
                          authorization: state.clientToken,
                          paypal: { flow: "vault" },
                        }}
                        onInstance={(instance) => setState((prevState) => ({ ...prevState, instance }))}
                      />
                    ) : state.clientToken === false ? (
                      <div className="bg-yellow-100 text-yellow-800 py-3 px-4 rounded">
                        Online payment is currently unavailable. You can still use Cash on Delivery.
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <svg className="w-10 h-10 animate-spin text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 bg-green-100 text-green-800 py-3 px-4 rounded">
                    Cash on Delivery selected. Payment status will be saved as pending until delivery.
                  </div>
                )}

                <button
                  disabled={state.processing}
                  onClick={() =>
                    state.paymentMethod === "COD"
                      ? placeCodOrder(data, dispatch, state, setState, totalCost, history)
                      : pay(data, dispatch, state, setState, getPaymentProcess, totalCost, history)
                  }
                  className="w-full mt-6 px-4 py-3 rounded text-center text-white font-semibold cursor-pointer bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
                >
                  {state.processing ? "Processing..." : state.paymentMethod === "COD" ? "Place COD order" : "Pay now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

const CheckoutProducts = ({ products }) => {
  const history = useHistory();

  return (
    <Fragment>
      <div className="space-y-4">
        {products !== null && products && products.length > 0 ? (
          products.map((product, index) => {
            return (
              <div key={index} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                <img
                  onClick={() => history.push(`/products/${product._id}`)}
                  className="cursor-pointer h-20 w-20 rounded object-cover object-center border"
                  src={`${apiURL}/uploads/products/${product.pImages[0]}`}
                  alt={product.pName}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-semibold text-gray-900 truncate">{product.pName}</div>
                  <div className="text-gray-600 text-sm">Price: ${product.pPrice}.00</div>
                  <div className="text-gray-600 text-sm">Quantity: {quantity(product._id)}</div>
                  <div className="font-semibold text-gray-800 text-sm">Subtotal: ${subTotal(product._id, product.pPrice)}.00</div>
                </div>
              </div>
            );
          })
        ) : (
          <div>No product found for checkout</div>
        )}
      </div>
    </Fragment>
  );
};

export default CheckoutProducts;
