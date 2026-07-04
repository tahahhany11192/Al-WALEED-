import React, { Fragment, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { getAllProduct } from "../../admin/products/FetchApi";
import { HomeContext } from "./index";
import { isWishReq, unWishReq, isWish } from "./Mixins";

const apiURL = process.env.REACT_APP_API_URL;

const SingleProduct = () => {
  const { data, dispatch } = useContext(HomeContext);
  const { products } = data;
  const history = useHistory();

  const [wList, setWlist] = useState(JSON.parse(localStorage.getItem("wishList")) || []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      let responseData = await getAllProduct();
      setTimeout(() => {
        if (responseData && responseData.Products) {
          dispatch({ type: "setProducts", payload: responseData.Products });
        }
        dispatch({ type: "loading", payload: false });
      }, 500);
    } catch (error) {
      dispatch({ type: "loading", payload: false });
      console.log(error);
    }
  };

  if (data.loading) {
    return (
      <div className="col-span-2 md:col-span-3 lg:col-span-4 flex items-center justify-center py-24">
        <svg className="w-12 h-12 animate-spin text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      </div>
    );
  }

  return (
    <Fragment>
      {products && products.length > 0 ? (
        products.map((item, index) => {
          return (
            <Fragment key={index}>
              <div className="hayroo-card relative col-span-1 m-2 overflow-hidden">
                <div className="relative bg-gray-100">
                  <img
                    onClick={() => history.push(`/products/${item._id}`)}
                    className="w-full h-56 md:h-64 object-cover object-center cursor-pointer"
                    src={`${apiURL}/uploads/products/${item.pImages[0]}`}
                    alt={item.pName}
                  />
                  <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 text-xs font-semibold text-gray-800 shadow">
                    {item.pCategory && item.pCategory.cName ? item.pCategory.cName : "Product"}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between space-x-3">
                    <div className="min-w-0">
                      <div className="text-gray-900 font-semibold truncate">{item.pName}</div>
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">{item.pDescription}</div>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-700">
                      <svg className="w-4 h-4 fill-current text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span>{item.pRatingsReviews.length}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xl font-bold text-gray-900">${item.pPrice}.00</div>
                    <button onClick={() => history.push(`/products/${item._id}`)} className="hayroo-btn px-4 py-2 text-sm font-semibold">
                      View
                    </button>
                  </div>
                </div>

                <div className="absolute top-3 right-3 bg-white rounded-full shadow">
                  <svg
                    onClick={(e) => isWishReq(e, item._id, setWlist)}
                    className={`${isWish(item._id, wList) && "hidden"} w-10 h-10 p-2 cursor-pointer text-gray-700 hover:text-yellow-700 transition-all duration-300 ease-in`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <svg
                    onClick={(e) => unWishReq(e, item._id, setWlist)}
                    className={`${!isWish(item._id, wList) && "hidden"} w-10 h-10 p-2 cursor-pointer text-yellow-700 transition-all duration-300 ease-in`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Fragment>
          );
        })
      ) : (
        <div className="col-span-2 md:col-span-3 lg:col-span-4 flex items-center justify-center py-24 text-2xl">
          No product found
        </div>
      )}
    </Fragment>
  );
};

export default SingleProduct;
