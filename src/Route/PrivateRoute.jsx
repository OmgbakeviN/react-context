import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { user, token } = useSelector((state) => state.auth);

  const localStorageToken = localStorage.getItem("token");
  const localStorageUser = localStorage.getItem("user");

  const isAuthenticated =
    (user && token) || (localStorageToken && localStorageUser);

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`${process.env.PUBLIC_URL}/pages/authentication/login-bg-img/compact-wrapper`}
        replace
      />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
