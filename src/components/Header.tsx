import React, { useState, useEffect, useRef } from 'react';
import userPlaceholder from "../assets/images/user.png";
import downIcon from "../assets/icons/chevron-down-outline.svg";
import haletaleLogo from "../assets/images/logo_png_big.png";
import bellIcon from "../assets/images/noti-icon.png";
import menuIcon from "../assets/icons/menu.png";
import style from "./Header.module.scss";
import { ButtonHollow } from './Button';
import { ButtonSolid } from './Button';
import { useClickOutsideEvent } from '../functions/hooks/useClickOutsideEvent';
export default function Header(): JSX.Element {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loginModalOpen, setloginModalOpen] = useState(false);
    const logedin = false;//temporary
    const dropDownref = useRef<HTMLDivElement>(null!);
    useClickOutsideEvent(dropDownref, () => setDropdownOpen(false));
    const loginModalref = useRef<HTMLDivElement>(null!);
    useClickOutsideEvent(loginModalref, () => setloginModalOpen(false));
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
                            <div className={style["profile-dropdown"]} ref={dropDownref} onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <p>Welcome <span className={style["name-highlight"]}>John!</span></p>
                                <div className={style["profile-dropdown-down"]} >
                                    <img src={downIcon} />
                                </div>
                                <div className={`${style["dropdown-box"]} ${!dropdownOpen && style["is-close"]}`} >
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

                        :
                        <>
                            <ButtonHollow onClick={() => setloginModalOpen(true)} label="Sign in" />
                            <ButtonSolid label="Sign up" />
                        </>
                    }

                    <div>
                    </div>


                </div>
            </div>
        </div>
    );
}