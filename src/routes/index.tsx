//import { render } from "react-dom";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import HomePage from "../pages/Home";
import PropertyListing from "../pages/PropertySearchListing";
import AddProperty from '../pages/AddProperty';
import Signup from "../pages/SignUp";

export default function () {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={< HomePage />} />
                <Route path="/properties" element={< PropertyListing />} />
                <Route path="/addProperty" element={< AddProperty />} />
                <Route path="/signup" element={< Signup />} />

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
