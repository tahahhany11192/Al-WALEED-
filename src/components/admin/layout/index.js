import React, { Fragment } from "react";
import AdminNavber from "../partials/AdminNavber";
import AdminSidebar from "../partials/AdminSidebar";
import AdminFooter from "../partials/AdminFooter";

const AdminLayout = ({ children }) => {
  return (
    <Fragment>
      <AdminNavber />

      <section className="flex bg-gray-100 min-h-screen">
        <AdminSidebar />

        <main className="w-full md:w-9/12 lg:w-10/12 min-h-screen p-3 sm:p-4 lg:p-6 pb-24 md:pb-6 overflow-x-hidden">
          {children}
        </main>
      </section>

      <AdminFooter />
    </Fragment>
  );
};

export default AdminLayout;
