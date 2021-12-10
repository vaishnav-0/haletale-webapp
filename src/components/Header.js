import React, { useState, useEffect, useRef } from 'react';
import userPlaceholder from "../assets/images/user.png";
import downIcon from "../assets/icons/chevron-down-outline.svg";
import haletaleLogo from "../assets/images/logo_png_big.png";
import bellIcon from "../assets/images/noti-icon.png";
import menuIcon from "../assets/icons/menu.png";
import "./Header.scss";
import { ButtonHollow } from './Button';
import { ButtonSolid } from './Button';
export default function Header() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const ref = useRef(null);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);
    return (
        <div className="header">
            <div className="topnav">
                <div className="topnav-left-container">
                    <div className="logo">
                        <img src={haletaleLogo} />
                    </div>
                </div>
                <div className="topnav-right-container">

                    <div className="profile-container">
                        <img src={userPlaceholder} />
                        <div className="profile-dropdown" ref={ref} onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <p>Welcome <span className="name-highlight">John!</span></p>
                            <div className="profile-dropdown-down" >
                                <img src={downIcon} />
                            </div>
                            <div className={`dropdown-box ${!dropdownOpen ? "is-close" : ""}`} >
                                <a href="#">Profile{dropdownOpen}</a>
                                <a href="#">Change Password</a>
                                <a href="#">Account</a>
                                <a href="#">Notifications</a>
                                <a href="#">Your Bookings</a>
                                <a href="#">Wishlist</a>
                                <a href="#">Settings</a>
                                <a href="#">Help</a>
                                <a href="#">Logout</a>
                            </div>
                        </div>
                    </div>
                                        {/*

                    <div className="notifbell">
                        <img src={bellIcon} />
                    </div>

                    <ButtonHollow label="Sign in" />
                    <ButtonSolid label="Sign up" />

                                        */}


                </div>
            </div>
        </div>
    );
}