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
                        navigate("/signup");
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
                <li>
                    <ul>Tenant services</ul>
                    <ul><a href="#">Verification</a></ul>
                    <ul><a href="#">Update Booking</a></ul>
                    <ul><a href="#">Cancel Booking</a></ul>
                    <ul><a href="#">Maintenance Requests</a></ul>
                    <ul><a href="#">Check in Details</a></ul>
                </li>
                <li>
                    <ul>Landlord services</ul>

                    <ul><a href="#">My propertyperties</a></ul>
                    <ul><a href="#">Booking Requests</a></ul>
                    <ul><a href="#">Maintenance Requests</a></ul>
                </li></div>

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
