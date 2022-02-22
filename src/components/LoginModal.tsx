import React from 'react';
import style from './LoginModal.module.scss';
import haletaleLogo from "../assets/images/logo_png_big.png";
import { ButtonSolid } from './Button';
import auth from '../functions/auth/index';
import googleLogo from '../assets/icons/google-logo.png';
import fbLogo from '../assets/icons/fb_logo_color.png';
import { useNavigate } from 'react-router-dom';
import FormGenerator, { SchemaType } from '../components/Form/FormGenerator';
import { validateSchema } from 'graphql';
import { MessageBox } from './MessageBox';
import { resendConfirmationCode } from '../functions/auth/cognito';
import { toast } from 'react-toastify';
import * as yup from 'yup';
const schema: SchemaType = {
    heading: "",
    items: [
        {
            title: "Email address",
            name: "email",
            type: "text",
            props: {
                type: "text"
            },
            validationSchema: yup.string().email().required()
        },
        {
            title: "Password",
            name: "password",
            type: "text",
            props: {
                type: "password"
            },
            validationSchema: yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        },
    ],
    submitButton: () => <div className={style["signin-btn"]}>
        <ButtonSolid>Sign In</ButtonSolid>
    </div>
}
type props = {
    signUpUrl: string,
    onClose: () => void;
}
function resendCode(email: string, onSuccess?: () => void) {
    console.log(email);
    resendConfirmationCode(email,
        (err: any, data: any) => {
            if (!err) {
                toast.success('Confirmation link sent.', {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            else {
                if (err.name === "LimitExceededException")
                    toast.error('Limit exceeded. Try again later.', {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                else
                    toast.error('There was an error.', {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
            }

            console.log(JSON.stringify(err), data)
        })
}
function onSubmit(d: any, SuccessAction: Function) {
    auth.emailPasswordSignIn({ email: d.email, password: d.password },
        (err: any, data: any) => {
            if (data)
                SuccessAction();
            if (err?.code === "UserNotConfirmedException") {
                toast.warn(({ closeToast }) => <div className={style["confirm-container"]}>
                    <div>Your account is not confirmed</div>
                    <button
                        onClick={() => resendCode(d.email, () => closeToast && closeToast())}
                        className={style["confirm-btn"]}>(Resend confirmation link)</button>
                </div >, {
                    position: "bottom-center",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        });
}
function LoginModal({ onClose = () => { }, signUpUrl }: props): JSX.Element {
    const navigate = useNavigate();
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
            <div className={style["modal-item-list"]} style={{ paddingTop: "1em" }}>
                <div className={style["modal-item"]}>
                    <FormGenerator onSubmit={(d) => onSubmit(d, () => onClose())} schema={schema} />
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
                        <button type='button' onClick={() => auth.oauth('Google')}>
                            <img src={googleLogo} />

                        </button>
                        <button type='button' onClick={() => auth.oauth('FaceBook')}>
                            <img src={fbLogo} />

                        </button>

                    </div>
                </div>
                <div className={style["modal-item"]}>
                    <div className={style["signup-message"]}>
                        Don't have an account?
                        <span>
                            <button type="button" onClick={() => navigate(signUpUrl)}>
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