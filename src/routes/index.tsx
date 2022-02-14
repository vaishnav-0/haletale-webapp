//import { render } from "react-dom";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { RequireAuth } from "./RequireAuth";
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

export default function () {
    let auth = useAuth();
    return (
        <BrowserRouter>
            {
                (auth?.user && ['user'].some(e => (auth.user?.role as string[]).includes(e))) ?
                    <Routes>
                        <Route path="/" element={<RequireAuth role={[Roles['user']]} />}>
                            <Route path="pickRole" element={< SelectRole />} />
                            <Route
                                path="*"
                                element={<Navigate to="/pickRole" replace />}
                            />
                        </Route>
                    </Routes> :
                    <Routes>

                        <Route path="/">
                            <Route index element={< HomePage />} />
                            <Route path="properties" element={< PropertyListing />} />
                            <Route path="signup" element={< Signup />} />
                            <Route path="propertiesMapView" element={< MapView />} />
                            <Route path="PropertyDetailed" element={< PropertyDetailed />} />
                            <Route path="dashboard" element={< LandlordDashboard />} />
                            <Route path="signout" element={<Navigate to="/" replace />} />
                            <Route
                                path="*"
                                element={
                                    <main style={{ padding: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <p>There's nothing here!</p>
                                    </main>
                                }
                            />
                        </Route>
                        <Route path="/" element={<RequireAuth role={[Roles['landlord']]} />}>
                            <Route path="addProperty" element={< AddProperty />} />
                        </Route>
                        <Route path="/" element={<RequireAuth role={[Roles['tenant']]} />}>
                            <Route path="sendRequest" element={< SendRequest />} />
                        </Route>

                    </Routes>
            }
        </BrowserRouter >

    );
}
