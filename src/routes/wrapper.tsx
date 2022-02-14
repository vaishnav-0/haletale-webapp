import { Routes, Route, Link, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../functions/auth/useAuth';
export default function Wrapper() {
    let auth = useAuth();
    let location = useLocation();
    console.log(auth);
    if (auth === null)
        return null;
    if (auth.user !== null && ['user'].some(e => (auth.user?.role as string[]).includes(e))) {
        console.log(auth.user)
        return <Navigate to="/pickRole" state={{ from: location, openLoginModel: true }} replace />;
    } else {
        return <Outlet />
    }
}