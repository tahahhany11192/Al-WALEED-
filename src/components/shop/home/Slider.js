import React, { Fragment, useEffect, useContext, useState } from "react";
import OrderSuccessMessage from "./OrderSuccessMessage";
import { HomeContext } from "./";
import { sliderImages } from "../../admin/dashboardAdmin/Action";
import { prevSlide, nextSlide } from "./Mixins";

const apiURL = process.env.REACT_APP_API_URL;

const Slider = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    sliderImages(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasSlides = data.sliderImages && data.sliderImages.length > 0;

  return (
    <Fragment>
      <div className="relative mt-16 hayroo-hero bg-gray-900">
        {hasSlides ? (
          <img
            className="w-full opacity-75"
            src={`${apiURL}/uploads/customize/${data.sliderImages[slide].slideImage}`}
            alt="sliderImage"
          />
        ) : (
          <div className="w-full h-full min-h-screen bg-gray-900" />
        )}

        <div className="absolute inset-0 bg-black opacity-25" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="max-w-3xl text-center text-white">
            <div className="uppercase tracking-widest text-sm text-gray-200 mb-3">Modern ecommerce experience</div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">Shop faster, safer, and pay on delivery</h1>
            <p className="text-gray-200 text-lg mt-4">Browse products, checkout with address, phone and location, then choose COD or online payment.</p>
            <a href="#shop" className="inline-block hayroo-btn mt-8 px-8 py-3 text-lg font-semibold">
              Shop Now
            </a>
          </div>
        </div>

        {hasSlides && data.sliderImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => prevSlide(data.sliderImages.length, slide, setSlide)}
              className="z-10 absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full w-12 h-12 flex items-center justify-center text-gray-700 cursor-pointer hover:bg-opacity-100"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => nextSlide(data.sliderImages.length, slide, setSlide)}
              className="z-10 absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full w-12 h-12 flex items-center justify-center text-gray-700 cursor-pointer hover:bg-opacity-100"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        ) : null}
      </div>
      <OrderSuccessMessage />
    </Fragment>
  );
};

export default Slider;
