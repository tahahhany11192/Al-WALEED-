import React, { Fragment, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { loginReq } from "./fetchApi";
import { useSnackbar } from "notistack";

const AdminLogin = () => {
  const history = useHistory();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState({ email: "", password: "", error: "", loading: false });

  const formSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, loading: true, error: "" });

    const responseData = await loginReq({ email: data.email, password: data.password });
    if (responseData.error) {
      return setData({ ...data, loading: false, password: "", error: responseData.error });
    }

    if (responseData.token && responseData.user && responseData.user.role === 1) {
      localStorage.setItem("jwt", JSON.stringify(responseData));
      enqueueSnackbar("Admin login completed successfully", { variant: "success" });
      const from = location.state && location.state.from ? location.state.from.pathname : "/admin/dashboard";
      return history.push(from === "/admin/login" ? "/admin/dashboard" : from);
    }

    localStorage.removeItem("jwt");
    return setData({ ...data, loading: false, password: "", error: "This account is not an admin" });
  };

  return (
    <Fragment>
      <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-900 text-white px-8 py-8 text-center">
            <div className="uppercase tracking-widest text-sm text-gray-300">Hayroo Admin</div>
            <h1 className="text-3xl font-semibold mt-2">Secure Login</h1>
            <p className="text-gray-300 text-sm mt-2">Only authorized admin accounts can access the dashboard.</p>
          </div>

          <form onSubmit={formSubmit} className="px-8 py-8 space-y-5">
            {data.error ? <div className="bg-red-100 text-red-700 px-4 py-3 rounded">{data.error}</div> : ""}

            <div className="flex flex-col space-y-2">
              <label htmlFor="admin-email" className="font-medium text-gray-700">Email address</label>
              <input
                id="admin-email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value, error: "" })}
                type="email"
                className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-gray-900"
                placeholder="admin@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="admin-password" className="font-medium text-gray-700">Password</label>
              <input
                id="admin-password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value, error: "" })}
                type="password"
                className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-gray-900"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              disabled={data.loading}
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded px-4 py-3 transition duration-200 disabled:opacity-50"
            >
              {data.loading ? "Signing in..." : "Login to Dashboard"}
            </button>

            <button
              type="button"
              onClick={() => history.push("/")}
              className="w-full text-gray-600 hover:text-gray-900 text-sm"
            >
              Back to store
            </button>
          </form>
        </div>
      </section>
    </Fragment>
  );
};

export default AdminLogin;
