import React from 'react';
import style from './LoginModal.module.scss';
import haletaleLogo from "../assets/images/logo_png_big.png";
import googleLogo from '../assets/icons/google-logo.png';
import fbLogo from '../assets/icons/fb_logo_color.png';
import { TextInput } from './Form/components/TextInput';
import { ButtonSolid } from './Button';
type props = {
    onClose: () => void;
}
function LoginModal({ onClose = () => { } }: props): JSX.Element {
    return (
        <div className={style["modal-container"]}>
            <div className={style["modal-header"]}>
                <button onClick={onClose} className={style["modal-close-btn"]}>
                    <i className="fas fa-times" />
                </button>
                <div className={style["modal-title"]}>
                    <img src={haletaleLogo} />
                </div>
            </div>
            <div className={style["modal-item-list"]}>
                <div className={style["modal-item"]}>
                    <div className={style["modal-item-heading"]}>
                        Email address
                    </div>
                    <TextInput type="text" />
                </div>
                <div className={style["modal-item"]}>
                    <div className={style["modal-item-heading"]}>
                        Password
                    </div>
                    <TextInput type="password">
                        <button>
                            Forgot?
                        </button>
                    </TextInput>
                </div>
                <div className={style["modal-item"]}>
                    <div className={style["signin-btn"]}>
                        <ButtonSolid label='Sign In' />
                    </div>
                </div>
                <div className={style["modal-item"]}>
                    <div className={style["other-methods-message"]}>
                        <div className={style["line"]} />
                        <div>
                            Sign in with
                        </div>
                        <div className={style["line"]} />
                    </div>
                    <div className={style["other-methods-btn"]}>
                        <button>
                            <img src={googleLogo} />
                        </button>
                        <button>
                            <img className={style["fb-btn"]} src={fbLogo} />
                        </button>
                    </div>
                </div>
                <div className={style["modal-item"]}>
                    <div className={style["signup-message"]}>
                        Don't have an account?
                        <span>
                            <button>
                                Sign Up
                            </button>
                        </span>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default LoginModal;