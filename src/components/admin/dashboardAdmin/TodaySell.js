import React, { Fragment, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { DashboardContext } from "./";
import { todayAllOrders } from "./Action";

const apiURL = process.env.REACT_APP_API_URL;

const getOrderProducts = (order) => {
  return order && Array.isArray(order.allProduct) ? order.allProduct : [];
};

const getProductData = (cartItem) => {
  return cartItem && cartItem.id && typeof cartItem.id === "object"
    ? cartItem.id
    : null;
};

const getProductName = (cartItem) => {
  const product = getProductData(cartItem);
  return product && product.pName ? product.pName : "Deleted product";
};

const getProductImage = (cartItem) => {
  const product = getProductData(cartItem);

  if (product && Array.isArray(product.pImages) && product.pImages.length > 0) {
    return `${apiURL}/uploads/products/${product.pImages[0]}`;
  }

  return null;
};


const SellTable = () => {
  const history = useHistory();
  const { data, dispatch } = useContext(DashboardContext);

  useEffect(() => {
    todayAllOrders(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ordersList = () => {
    let newList = [];
    if (data.totalOrders.Orders !== undefined) {
      data.totalOrders.Orders.forEach(function (elem) {
        if (moment(elem.createdAt).format("LL") === moment().format("LL")) {
          newList = [...newList, elem];
        }
      });
    }
    return newList;
  };

  return (
    <Fragment>
      <div className="col-span-1 bg-white rounded-2xl shadow-md p-3 sm:p-4 overflow-x-auto">
        <div className="text-2xl font-semibold mb-6 text-center">
          Today's Orders{" "}
          {data.totalOrders.Orders !== undefined ? ordersList().length : 0}
        </div>
        <table className="table-auto border w-full my-2">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Products</th>
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Order Address</th>
              <th className="px-4 py-2 border">Ordered at</th>
            </tr>
          </thead>
          <tbody>
            {data.totalOrders.Orders !== undefined ? (
              ordersList().map((item, key) => {
                return <TodayOrderTable order={item} key={key} />;
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-xl text-center font-semibold py-8"
                >
                  No orders found today
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="text-sm text-gray-600 mt-2">
          Total{" "}
          {data.totalOrders.Orders !== undefined ? ordersList().length : 0}{" "}
          orders found
        </div>
        <div className="flex justify-center">
          <span
            onClick={(e) => history.push("/admin/dashboard/orders")}
            style={{ background: "#303031" }}
            className="cursor-pointer px-4 py-2 text-white rounded-full"
          >
            View All
          </span>
        </div>
      </div>
    </Fragment>
  );
};

const TodayOrderTable = ({ order }) => {
  const products = getOrderProducts(order);

  return (
    <Fragment>
      <tr>
        <td className="w-48 hover:bg-gray-200 p-2 flex flex-col space-y-1">
          {products.length > 0 ? (
            products.map((item, index) => {
              return (
                <div key={index} className="flex space-x-2">
                  <span>{getProductName(item)}</span>
                  <span>{item && item.quantitiy ? item.quantitiy : 1}x</span>
                </div>
              );
            })
          ) : (
            <span className="text-gray-500">No products</span>
          )}
        </td>

        <td className="p-2 text-left">
          {products.length > 0 ? (
            products.map((item, index) => {
              const imageSrc = getProductImage(item);

              return imageSrc ? (
                <img
                  key={index}
                  className="w-12 h-12 object-cover mb-1"
                  src={imageSrc}
                  alt={getProductName(item)}
                />
              ) : (
                <div
                  key={index}
                  className="w-12 h-12 mb-1 bg-gray-100 text-gray-500 text-xs flex items-center justify-center text-center"
                >
                  No image
                </div>
              );
            })
          ) : (
            <span className="text-gray-500">-</span>
          )}
        </td>

        <td className="p-2 text-center">
          {order.status === "Not processed" && (
            <span className="block text-red-600 rounded-full text-center text-xs px-2 font-semibold">
              {order.status}
            </span>
          )}

          {order.status === "Processing" && (
            <span className="block text-yellow-600 rounded-full text-center text-xs px-2 font-semibold">
              {order.status}
            </span>
          )}

          {order.status === "Shipped" && (
            <span className="block text-blue-600 rounded-full text-center text-xs px-2 font-semibold">
              {order.status}
            </span>
          )}

          {order.status === "Delivered" && (
            <span className="block text-green-600 rounded-full text-center text-xs px-2 font-semibold">
              {order.status}
            </span>
          )}

          {order.status === "Cancelled" && (
            <span className="block text-red-600 rounded-full text-center text-xs px-2 font-semibold">
              {order.status}
            </span>
          )}
        </td>

        <td className="p-2 text-center">{order.address || "-"}</td>

        <td className="p-2 text-center">
          {order.createdAt ? moment(order.createdAt).format("lll") : "-"}
        </td>
      </tr>
    </Fragment>
  );
};



const TodaySell = (props) => {
  return (
    <div className="m-4">
      <SellTable />
    </div>
  );
};

export default TodaySell;
