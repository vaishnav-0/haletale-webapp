//import { render } from "react-dom";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate,
} from "react-router-dom";
import { RequireAuth } from "./RequireAuth";
import { NotRequireAuth } from "./NotRequireAuth";
import HomePage from "../pages/Home";
import PropertyListing from "../pages/PropertySearchListing";
import AddProperty from '../pages/AddProperty';
import Signup from "../pages/SignUp";
import MapView from "../pages/MapView";
import PropertyDetailed from '../pages/PropertyDetailed'
import SendRequest from "../pages/SendRequest";
import { Roles } from "../functions/auth/types";
import LandlordDashboard from '../pages/LandlordDashboard'
import SelectRole from "../pages/SelectRole";
import { useAuth } from '../functions/auth/useAuth';
import AccountRoutes from "./Account";
import { NumberVerify } from "../pages/NumberVerify";
import EditProperty from "../pages/EditProperty";
import { toast } from "react-toastify";
import UserContext from "../functions/auth/userContext";
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
                                <Route path="propertiesMapView" element={< MapView />} />
                                <Route path="property/view" element={< PropertyDetailed />} />
                                <Route path="signout" element={<Navigate to="/" replace />} />
                                <Route
                                    path="*"
                                    element={
                                        <main style={{ padding: "1rem", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontSize: "2rem" }}>
                                            <p>There's nothing here!</p>
                                        </main>
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
                                <Route path="dashboard" element={< LandlordDashboard />} />
                                <Route path="property/edit" element={< EditProperty />} />
                            </Route>
                            <Route path="/" element={<RequireAuth onReject={(user) => { toast.warn("Sign in to send request", { toastId: 'warn1' }) }} role={[Roles['tenant']]} />}>
                                <Route path="sendRequest" element={< SendRequest />} />
                            </Route>

                        </Routes>
                }
            </BrowserRouter >
        </UserContext.Provider >
    );
}
