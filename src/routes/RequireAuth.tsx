import React from "react";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../functions/auth/useAuth";
import { Roles } from "../functions/auth/types";


/**
 * @description Redirect user to / if the user is not logged in and opens the login modal
 * @param children 
 * @param role 
 * @returns 
 */
export const RequireAuth = ({ children, role }: { children: JSX.Element, role: Roles }) => {

  let auth = useAuth();
  let location = useLocation();

  if (auth.user === null) {

    return <Navigate to="/" state={{ from: location, openLoginModel: true }} replace />;

  }

  if (auth.user.role !== role) return null;

  return children;
}