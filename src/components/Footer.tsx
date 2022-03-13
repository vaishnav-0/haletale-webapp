import React from 'react';
import "./Footer.scss";
import { useNavigate } from "react-router-dom";

export default function Footer(): JSX.Element {
    let navigate = useNavigate();
    return (
        <div className="footer">
            <div className="footer-top">
                <li>
                    <ul>Company</ul>
                    <ul><a href="#">Home</a></ul>
                    <ul><a onClick={() => {
                        navigate({ pathname: "/" }, { state: { openLoginModal: true } });
                    }}>Sign In / Sign Up</a></ul>
                    <ul><a href="#">About Us</a></ul>
                    <ul><a href="#">Contact Us</a></ul>
                </li>
                <li>
                    <ul>Quick Links</ul>

                    <ul><a onClick={() => {
                        navigate("/addProperty");
                    }} >propertyfile</a></ul>
                    <ul><a href="#">Notifications</a></ul>
                    <ul><a href="#">Your Bookings</a></ul>
                    <ul><a href="#">Wishlist</a></ul>
                    <ul><a href="#">Settings</a></ul>
                </li>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-left">
                    <a href="#">FAQs</a>
                    <div>|</div>
                    <a href="#">Terms & Conditions</a>
                    <div>|</div>
                    <a href="#">Privacy Policy</a>

                </div>
                <div className="footer-bottom-right">
                    © 2021-22 Haletale. All Rights Reserved.
                </div>
            </div>
        </div >
    );
}
