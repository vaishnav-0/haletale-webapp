import React from "react";
import { Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from "../functions/auth/useAuth";
import { IUser, Roles } from "../functions/auth/types";
/**
 * @description Redirect user to / if the user is not logged in and opens the login modal
 * @param children 
 * @param role 
 * @returns 
 */

export const RequireAuth = ({ role, redirect = "/", onReject = () => { } }: { role: Roles[] | [], redirect?: string, onReject?: (user: IUser | null) => void }) => {
  let auth = useAuth();
  let location = useLocation();
  const navigate = useNavigate();
  if (auth === null)  //auth initializing
    return null;
  if (role.length && (auth.user === null || !role.some(e => auth.user?.role.includes(e)))) {
    onReject(auth.user);
    return <Navigate to={redirect} state={{ from: location, openLoginModel: true }} replace />;
  } else {
    return <Outlet />;
  }
}