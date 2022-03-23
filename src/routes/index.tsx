//import { render } from "react-dom";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { RequireAuth } from "./RequireAuth";
import { NotRequireAuth } from "./NotRequireAuth";
import HomePage from "../pages/Home";
import PropertyListing from "../pages/PropertySearchListing";
import AddProperty from '../pages/Landlord/AddProperty';
import Signup from "../pages/SignUp";
import PropertyDetailed from '../pages/PropertyDetailed'
import SendRequest from "../pages/Tenant/SendRequest";
import { Roles } from "../functions/auth/types";
import LandlordDashboard, { ViewRequests } from '../pages/Landlord/LandlordDashboard'
import SelectRole from "../pages/SelectRole";
import { useAuth } from '../functions/auth/useAuth';
import AccountRoutes from "./Account";
import { NumberVerify } from "../pages/NumberVerify";
import EditProperty from "../pages/Landlord/EditProperty";
import { toast } from "react-toastify";
import UserContext from "../functions/auth/userContext";
import ViewFavourites from "../pages/Tenant/ViewFavourites";
import CenterContent from "../components/CenterContent";
import AdminDashboardRoutes from "./AdminDashboard";
import TenantDashboardRoutes from "./TenantDashboardRoutes";
import { ResetPassword } from "../pages/ResetPassword";
export default function () {
    const auth = useAuth();
    return (
        <UserContext.Provider value={auth?.user ?? null}>
            <BrowserRouter>
                {
                    (auth?.user && ['user'].some(e => (auth?.user?.role as string[]).includes(e))) ?
                        <Routes>
                            <Route path="*" element={< SelectRole />} />
                        </Routes> :
                        <Routes>

                            <Route path="/">
                                <Route index element={< HomePage />} />
                                <Route path="properties" element={< PropertyListing />} />
                                <Route path="property/view" element={< PropertyDetailed />} />
                                <Route path="signout" element={<Navigate to="/" replace />} />
                                <Route path="resetPassword" element={<ResetPassword />} />
                                <Route
                                    path="*"
                                    element={
                                        <div style={{ height: "100vh", fontSize: "2rem" }}>
                                            <CenterContent >
                                                <p>There's nothing here!</p>
                                            </CenterContent>
                                        </div>
                                    }
                                />
                            </Route>
                            <Route path="/" element={<NotRequireAuth />}>
                                <Route path="signup" element={< Signup />} />
                            </Route>
                            <Route path="/" element={<RequireAuth role={[Roles['landlord'], Roles['tenant']]} />}>
                                <Route path="verifyNumber" element={< NumberVerify />} />
                                <Route path="account/*" element={<AccountRoutes />} />
                            </Route>
                            <Route path="/" element={<RequireAuth role={[Roles['landlord']]} />}>
                                <Route path="property/add" element={< AddProperty />} />
                                <Route path="landlord/dashboard" element={< LandlordDashboard />} />
                                <Route path="landlord/dashboard/request/view" element={< ViewRequests />} />
                                <Route path="property/edit" element={< EditProperty />} />
                            </Route>
                            <Route path="/" element={<RequireAuth
                                onReject={(user) => {
                                    toast.warn("Sign in to send request", { toastId: 'warn1' })
                                }
                                }
                                openLoginModal
                                role={[Roles['tenant']]} />}>
                                <Route path="sendRequest" element={< SendRequest />} />
                            </Route>
                            <Route path="/" element={<RequireAuth role={[Roles['tenant']]} />}>
                                <Route path="tenant" element={<RequireAuth role={[Roles['tenant']]} />}>
                                    <Route path="dashboard/*" element={<TenantDashboardRoutes />} />
                                </Route>
                                <Route path="favourites" element={< ViewFavourites />} />
                            </Route>

                            <Route path="/admin" element={<RequireAuth role={[Roles['admin']]} />}>
                                <Route path="dashboard/*" element={<AdminDashboardRoutes />} />
                            </Route>
                        </Routes>
                }
            </BrowserRouter >
        </UserContext.Provider >
    );
}
