import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Loader from "../Layout/Loader";
import { authRoutes } from "./AuthRoutes";
import LayoutRoutes from "../Route/LayoutRoutes";
import LoginTwo from "../Components/Pages/Auth/LoginTwo";
import PrivateRoute from "./PrivateRoute";
import { classes } from "../Data/Layouts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




import RoleRoute from "./RoleRoute";
import ErrorPage2 from "../Components/Pages/ErrorPages/ErrorPage401"

const Routers = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const defaultLayoutObj = classes.find((item) =>
    Object.values(item).includes("compact-wrapper")
  );
  const layout = localStorage.getItem("layout") || Object.keys(defaultLayoutObj)[0];

  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const role = parsedUser?.role;

  
  let defaultRedirect = `${process.env.PUBLIC_URL}/dashboard/default/${layout}`;
  if (role === "REGIONAL") {
    defaultRedirect = `${process.env.PUBLIC_URL}/dashboard/default/${layout}`;
  } else if (role === "NATIONAL") {
    defaultRedirect = `${process.env.PUBLIC_URL}/dashboard/default/${layout}`;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    setAuthenticated(!!token && !!user);
  }, []);

  return (
    <BrowserRouter basename={"/"}>
      <ToastContainer position="top-right" autoClose={4000} newestOnTop />

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            {authenticated && (
              <>
                {/* Redirection par défaut selon le rôle */}
                <Route index element={<Navigate to={defaultRedirect} replace />} />
                <Route path="/" element={<Navigate to={defaultRedirect} replace />} />
              </>
            )}

            {/* ✅ Branches PROTÉGÉES PAR RÔLE */}
            <Route element={<RoleRoute allowed={["REGIONAL"]} />}>
              <Route path="dashboard/regional/*" element={<LayoutRoutes />} />
            </Route>

            <Route element={<RoleRoute allowed={["NATIONAL"]} />}>
              <Route path="dashboard/national/*" element={<LayoutRoutes />} />
            </Route>

            

            {/* Le reste de l'app protégée (par auth simple) */}
            <Route path="/*" element={<LayoutRoutes />} />
          </Route>

          {/* Page Unauthorized */}
          <Route
            path={`${process.env.PUBLIC_URL}/pages/errors/error401/${layout}`}
            element={<ErrorPage2 />}
          />

          {/* Route de login (publique) */}
          <Route
            path={`${process.env.PUBLIC_URL}/pages/authentication/login-bg-img/:layout`}
            element={<LoginTwo />}
          />

          {/* Routes publiques d'auth */}
          {authRoutes.map(({ path, Component }, i) => (
            <Route path={path} element={Component} key={i} />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Routers;
