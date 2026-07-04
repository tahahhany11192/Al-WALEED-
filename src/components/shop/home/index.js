import React, { Fragment, createContext, useReducer } from "react";
import Layout from "../layout";
import Slider from "./Slider";
import ProductCategory from "./ProductCategory";
import { homeState, homeReducer } from "./HomeContext";
import SingleProduct from "./SingleProduct";

export const HomeContext = createContext();

const HomeComponent = () => {
  return (
    <Fragment>
      <Slider />
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-8" id="shop">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <div className="text-sm uppercase tracking-widest text-gray-500">Shop by category</div>
            <h2 className="text-3xl font-semibold text-gray-900">Featured products</h2>
          </div>
          <div className="mt-4 md:mt-0">
            <ProductCategory />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <SingleProduct />
      </section>
    </Fragment>
  );
};

const Home = () => {
  const [data, dispatch] = useReducer(homeReducer, homeState);
  return (
    <Fragment>
      <HomeContext.Provider value={{ data, dispatch }}>
        <Layout children={<HomeComponent />} />
      </HomeContext.Provider>
    </Fragment>
  );
};

export default Home;
