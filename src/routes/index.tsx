//import { render } from "react-dom";
import {
    BrowserRouter,
    Routes,
    Route
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


export default function () {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={< HomePage />} />
                <Route path="/properties" element={< PropertyListing />} />
                <Route path="/addProperty" element={<RequireAuth role={Roles.landlord}>
                    < AddProperty />
                </RequireAuth>} />
                <Route path="/signup" element={< Signup />} />
                <Route path="/propertiesMapView" element={< MapView />} />
                <Route path="/PropertyDetailed" element={< PropertyDetailed />} />
                <Route path="/sendRequest" element={< SendRequest />} />

                <Route
                    path="*"
                    element={
                        <main style={{ padding: "1rem" }}>
                            <p>There's nothing here!</p>
                        </main>
                    }
                />
            </Routes>
        </BrowserRouter>

    );
}
