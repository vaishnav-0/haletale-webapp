import React, { useState, useEffect, useRef } from 'react';
import userPlaceholder from "../assets/images/profile_placeholder.png";
import downIcon from "../assets/icons/chevron-down-outline.svg";
import haletaleLogo from "../assets/images/logo_png_big.png";
import bellIcon from "../assets/images/noti-icon.png";
import menuIcon from "../assets/icons/menu.png";
import LoginModal from '../components/LoginModal';
import style from "./Header.module.scss";
import { ButtonHollow } from './Button';
import { ButtonSolid } from './Button';
import { Openable } from './Openable';
import { useAuth } from '../functions/auth/useAuth';
import auth from '../functions/auth';
import { Link } from "react-router-dom";
import { Roles } from '../functions/auth/types';

export default function Header(): JSX.Element {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loginModalOpen, setloginModalOpen] = useState(false);
    const authContext = useAuth();//temporary
    return (
        <div className={style["header"]}>
            <div className={style["topnav"]}>
                <div className={style["topnav-left-container"]}>
                    <div className={style["logo"]}>
                        <img src={haletaleLogo} />
                    </div>
                </div>
                <div className={style["topnav-right-container"]}>

                    {authContext?.user ?
                        <div className={style["profile-container"]}>
                            <img src={userPlaceholder} />
                            <Openable                           //seems hacky
                                open={[true, setDropdownOpen]}
                                className={style["profile-dropdown"]}
                                onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <p>Welcome <span className={style["name-highlight"]}>{authContext.user?.user_details?.name ?? "User"}!</span></p>
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
                                    <Link to="/account/basics">Profile</Link>
                                    <Link to="#">Change Password</Link>
                                    {//<Link to="#">Account</Link>
                                        //<Link to="#">Notifications</Link>
                                    }
                                    {authContext.user.role.includes(Roles['tenant']) && <>
                                        <Link to="/bookings">Your Bookings</Link>
                                        <Link to="/wishlist">Wishlist</Link>
                                    </>

                                    }
                                    {authContext.user.role.includes(Roles['landlord']) && <>
                                        <Link to="/dashboard">Dashboard</Link>
                                    </>

                                    }
                                    {// <Link to="#">Settings</Link>
                                    }
                                    <Link to="#">Help</Link>
                                    <Link to="/signout" onClick={() => auth.signOut()}>Logout</Link>
                                </Openable>
                            </Openable>
                        </div>

                        :
                        <>
                            <ButtonHollow onClick={() => setloginModalOpen(true)}> Sign in </ButtonHollow>
                            <ButtonSolid>Sign up</ButtonSolid>
                            <div className={style["modal-background"]} style={{ display: loginModalOpen ? "" : "none" }}>

                                <Openable className={style["login-container"]} open={[loginModalOpen, setloginModalOpen]}>
                                    <LoginModal signUpUrl="/signUp" onClose={() => {
                                        setloginModalOpen(false);
                                    }} />

                                </Openable>
                            </div>

                        </>
                    }

                </div>
            </div>
        </div >
    );
}