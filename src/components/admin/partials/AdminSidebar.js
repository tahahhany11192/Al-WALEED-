import React, { Fragment } from "react";
import { useLocation, useHistory } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    ),
  },
  {
    label: "Categories",
    path: "/admin/dashboard/categories",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    ),
  },
  {
    label: "Products",
    path: "/admin/dashboard/products",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
      />
    ),
  },
  {
    label: "Orders",
    path: "/admin/dashboard/orders",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      />
    ),
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const history = useHistory();

  const isActive = (path) => location.pathname === path;

  return (
    <Fragment>
      {/* Desktop / iPad Sidebar */}
      <aside className="hidden md:block sticky top-0 left-0 h-screen md:w-3/12 lg:w-2/12 bg-white text-gray-600 shadow-lg overflow-y-auto">
        <div className="py-4">
          {menuItems.map((item) => (
            <div
              key={item.path}
              onClick={() => history.push(item.path)}
              className={`${
                isActive(item.path)
                  ? "border-r-4 border-gray-900 bg-gray-100 text-gray-900"
                  : "text-gray-600"
              } hover:bg-gray-100 cursor-pointer flex flex-col items-center justify-center py-5 transition`}
            >
              <svg
                className="w-7 h-7 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {item.icon}
              </svg>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Phone Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl">
        <div className="grid grid-cols-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => history.push(item.path)}
              className={`flex flex-col items-center justify-center py-2 text-xs ${
                isActive(item.path)
                  ? "text-gray-900 font-semibold bg-gray-100"
                  : "text-gray-500"
              }`}
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {item.icon}
              </svg>
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </Fragment>
  );
};

export default AdminSidebar;
