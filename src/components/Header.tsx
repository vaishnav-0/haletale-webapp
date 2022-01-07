import React, { useState, useEffect, useRef } from 'react';
import userPlaceholder from "../assets/images/user.png";
import downIcon from "../assets/icons/chevron-down-outline.svg";
import haletaleLogo from "../assets/images/logo_png_big.png";
import bellIcon from "../assets/images/noti-icon.png";
import menuIcon from "../assets/icons/menu.png";
import LoginModal from '../components/LoginModal';
import style from "./Header.module.scss";
import { ButtonHollow } from './Button';
import { ButtonSolid } from './Button';
import { Openable } from './Openable';
export default function Header(): JSX.Element {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loginModalOpen, setloginModalOpen] = useState(false);
    const logedin = true;//temporary
    return (
        <div className={style["header"]}>
            <div className={style["topnav"]}>
                <div className={style["topnav-left-container"]}>
                    <div className={style["logo"]}>
                        <img src={haletaleLogo} />
                    </div>
                </div>
                <div className={style["topnav-right-container"]}>

                    {logedin ?
                        <div className={style["profile-container"]}>
                            <img src={userPlaceholder} />
                            <Openable                           //seems hacky
                                open={[true, setDropdownOpen]}
                                className={style["profile-dropdown"]}
                                onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <p>Welcome <span className={style["name-highlight"]}>John!</span></p>
                                <div className={style["profile-dropdown-down"]} >
                                    <img src={downIcon} />
                                </div>
                                <Openable
                                    open={[dropdownOpen, setDropdownOpen]}
                                    closeOnClickOutside={false}
                                    className={style["dropdown-box"]}
                                    animation={{
                                        type: "slide"
                                    }}
                                    onClick={e => e.stopPropagation()}
                                >
                                    <a href="#">Profile{dropdownOpen}</a>
                                    <a href="#">Change Password</a>
                                    <a href="#">Account</a>
                                    <a href="#">Notifications</a>
                                    <a href="#">Your Bookings</a>
                                    <a href="#">Wishlist</a>
                                    <a href="#">Settings</a>
                                    <a href="#">Help</a>
                                    <a href="#">Logout</a>
                                </Openable>
                            </Openable>
                        </div>

                        :
                        <>
                            <ButtonHollow onClick={() => setloginModalOpen(true)}> Sign in </ButtonHollow>
                            <ButtonSolid>Sign up</ButtonSolid>
                            <div className={style["modal-background"]} style={{ display: loginModalOpen ? "" : "none" }}>

                                <Openable className={style["login-container"]} open={[loginModalOpen, setloginModalOpen]}>
                                    <LoginModal onClose={() => {
                                        setloginModalOpen(false);
                                    }} />

                                </Openable>
                            </div>

                        </>
                    }

                </div>
            </div>
        </div>
    );
}