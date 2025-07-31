import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleRoute = ({ allowed }) => {
  const { user } = useSelector((state) => state.auth);

  const localUser = !user ? JSON.parse(localStorage.getItem('user') || 'null') : null;
  const role = user?.role || localUser?.role;

  if (!role) {
    return (
      <Navigate
        to={`${process.env.PUBLIC_URL}/pages/authentication/login-bg-img/compact-wrapper`}
        replace
      />
    );
  }

  if (!allowed.includes(role)) {
    return (
      <Navigate
        to={`${process.env.PUBLIC_URL}/pages/errors/error401/${layout}`}
        replace
      />
    );
  }

  return <Outlet />;
};

export default RoleRoute;
