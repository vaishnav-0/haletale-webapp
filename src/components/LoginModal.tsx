import React from 'react';
import style from './LoginModal.module.scss';
import haletaleLogo from "../assets/images/logo_png_big.png";
import { TextInput } from './Form/';
import { ButtonSolid } from './Button';
import { signIn } from '../functions/auth/index';
import googleLogo from '../assets/icons/google-logo.png';
import fbLogo from '../assets/icons/fb_logo_color.png';
import { useForm, FormProvider } from 'react-hook-form';

type props = {
    onClose: () => void;
}
function LoginModal({ onClose = () => { } }: props): JSX.Element {
    const methods = useForm();
    return (
        <FormProvider {...methods}>

            <form className={style["modal-container"]}>
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
                        <TextInput name="email" type="text" />
                    </div>
                    <div className={style["modal-item"]}>
                        <div className={style["modal-item-heading"]}>
                            Password
                        </div>
                        <TextInput name="password" type="password">
                            <button>
                                Forgot?
                            </button>
                        </TextInput>
                    </div>
                    <div className={style["modal-item"]}>
                        <div className={style["signin-btn"]}>
                            <ButtonSolid>Sign In</ButtonSolid>
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
                            <button type='button' onClick={() => signIn('Google')}>
                                <img src={googleLogo} />

                            </button>
                            <button type='button' onClick={() => signIn('Facebook')}>
                                <img src={fbLogo} />

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
            </form>
        </FormProvider>
    );
}

export default LoginModal;