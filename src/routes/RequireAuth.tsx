import React from "react";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../functions/auth/useAuth";
import { Roles } from "../functions/auth/authContext";
 

/**
 * @description Redirect user to / if the user is not logged in and opens the login modal
 * @param children 
 * @param role 
 * @returns 
 */
export const RequireAuth = ({ children }: { children: JSX.Element }, role: Roles) => {

  let auth = useAuth();
  let location = useLocation();

  if (auth.token === null) {

    return <Navigate to="/" state={{ from: location, openLoginModel: true }} replace />;

  }

  if (auth.role !== role) return;

  return children;
}