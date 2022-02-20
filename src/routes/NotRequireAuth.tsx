import React from "react";
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from "../functions/auth/useAuth";

/**
 * @description 
 * @returns 
 */

export const NotRequireAuth = ({ redirect = "/" }: { redirect?: string }) => {
  let auth = useAuth();
  let location = useLocation();
  if (auth === null)  //auth initializing
    return null;

  if (auth.user === null) {
    return <Outlet />
  } else {
    return <Navigate to={redirect} state={{ from: location, openLoginModel: true }} replace />;
  }
}