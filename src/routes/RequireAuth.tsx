import React from "react";
import { Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from "../functions/auth/useAuth";
import { IUser, Roles } from "../functions/auth/types";
import UserContext from "../functions/auth/userContext";
/**
 * @description Redirect user to / if the user is not logged in and opens the login modal
 * @param children 
 * @param role 
 * @returns 
 */

export const RequireAuth = ({ role, redirect = "/", onReject = () => { }, openLoginModal = false }:
  { role: Roles[] | [], redirect?: string, onReject?: (user: IUser | null) => void, openLoginModal?: boolean }) => {
  let auth = useAuth();
  let location = useLocation();
  if (auth === null)  //auth initializing
    return null;
  if (role.length && (auth.user === null || !role.some(e => auth!.user?.role.includes(e)))) {
    onReject(auth.user);
    return <Navigate to={redirect} state={{ from: location, openLoginModal: openLoginModal }} replace />;
  } else {
    return <Outlet />;
  }
}