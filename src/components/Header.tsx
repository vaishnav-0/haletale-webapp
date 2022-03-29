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
import auth from '../functions/auth';
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Roles } from '../functions/auth/types';
import { useUserContext } from '../functions/auth/userContext';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Header(): JSX.Element {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loginModalOpen, setloginModalOpen] = useState(false);
    const user = useUserContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    React.useEffect(() => {
        location.state?.openLoginModal && setloginModalOpen(true);
    }, [location])
    React.useEffect(() => {
        if (searchParams.get("login") === "true")
            setloginModalOpen(true);
    }, [searchParams])
    return (
        <div className={style["header"]}>
            <div className={style["topnav"]}>
                <div className={style["topnav-left-container"]}>
                    <Link
                        className={style["logo"]}
                        to="/"
                    >
                        <img src={haletaleLogo} />
                    </Link>
                </div>
                <div className={style["modal-background"]} style={{ display: loginModalOpen && !user ? "" : "none" }}>
                    <Openable className={style["login-container"]} open={[loginModalOpen, setloginModalOpen]}>
                        <LoginModal signUpUrl="/signUp" onClose={() => {
                            setloginModalOpen(false);
                        }} />

                    </Openable>
                </div>
                <div className={style["topnav-right-container"]}>

                    {user ?
                        <>
                            {
                                user.role.includes(Roles['landlord']) &&
                                <ButtonSolid onClick={() => navigate("/property/add")}> List property </ButtonSolid>
                            }
                            <div className={style["profile-container"]}>
                                <img src={userPlaceholder} />
                                <Openable                           //seems hacky
                                    open={[true, setDropdownOpen]}
                                    className={style["profile-dropdown"]}
                                    onClick={() => setDropdownOpen(!dropdownOpen)}>
                                    <p>Welcome
                                        <span className={style["name-highlight"]}>
                                            {
                                                user && !user.user_details ?
                                                    <Skeleton style={{ width: "100%", height: "100%" }} />
                                                    :
                                                    ` ${user?.user_details?.name ?? "User"}!`
                                            }

                                        </span></p>
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
                                        {user.role.includes(Roles['landlord']) && <>
                                            <Link to="/landlord/dashboard">Dashboard</Link>
                                        </>

                                        }
                                        {user.role.includes(Roles['admin']) && <>
                                            <Link to="/admin/dashboard">Dashboard</Link>
                                        </>

                                        } {user.role.includes(Roles['tenant']) && <>
                                            <Link to="/tenant/dashboard">Dashboard</Link>
                                        </>

                                        }
                                        {(user.role.includes(Roles['tenant']) || user.role.includes(Roles['landlord'])) && <>
                                            <Link to="/account/basics">Profile</Link>
                                        </>

                                        }
                                        {//<Link to="#">Change Password</Link>
                                        }
                                        {//<Link to="#">Account</Link>
                                            //<Link to="#">Notifications</Link>
                                        }
                                        {user.role.includes(Roles['tenant']) && <>
                                            <Link to="/favourites">Favorites</Link>
                                        </>

                                        }

                                        {// <Link to="#">Settings</Link>
                                        }
                                        <Link to="#">Help</Link>
                                        <Link to="" onClick={() => auth.signOut()}>Logout</Link>
                                    </Openable>
                                </Openable>
                            </div>
                        </>
                        :
                        <>
                            <ButtonHollow onClick={() => setloginModalOpen(true)}> Sign in / Sign up </ButtonHollow>


                        </>
                    }

                </div>
            </div>
        </div >
    );
}