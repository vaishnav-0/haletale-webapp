import React from 'react';
import userPlaceholder from "../assets/images/user.png";
import downIcon from "../assets/icons/chevron-down-outline.svg";
import haletaleLogo from "../assets/images/logo_png_big.png";
import bellIcon from "../assets/images/noti-icon.png";
import "./Header.css";
export default function Header() {
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
                        <div className="profile-dropdown">
                            <p>Welcome <span className="name-highlight">John!</span></p>
                            <div className="profile-dropdown-down">
                                <img src={downIcon} />
                            </div>
                        </div>
                    </div>
                    <div className="notifbell">
                        <img src={bellIcon} />
                    </div>
                    {/*
                    <button className="btn-smoothround-hollow">Sign In</button>
                    <button className="btn-smoothround-solid">Sign Up</button>
                    <div className="menuicon">
                        <img src="menu-button-of-three-horizontal-lines.png" />
                    </div>
                    */}


                </div>
            </div>
        </div>
    );
}