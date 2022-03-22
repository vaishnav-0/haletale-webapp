import React, { useRef } from "react";
import { Link, Navigate, useNavigate, } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import { toast } from "react-toastify";
import * as yup from 'yup';
import { ButtonSolid } from "../components/Button";
import FormGenerator, { FormDataShape, SchemaType } from "../components/Form/FormGenerator";
import { confirmPassword, intitiateForgotPassword } from "../functions/auth/cognito";
import { useAuth } from "../functions/auth/useAuth";
import Layout from "./Layout";

const resetInitiateSchema = {
    heading: "",
    items: [
        {
            title: "Email",
            name: "email",
            type: "text",
            props: {
                type: "text"
            },
            validationSchema: yup.string().email("Enter a valid email address").required("Email is required.")
        }
    ],
    submitButton: "Send code",
} as const;
const resetSchema = {
    heading: "",
    items: [
        {
            title: "Conformation code",
            name: "conformation_code",
            type: "text",
            props: {
                type: "text"
            },
            validationSchema: yup.string().required("Enter conformation code.")
        },
        {
            title: "New password",
            name: "new_password",
            type: "text",
            props: {
                type: "password"
            },
            validationSchema: yup.string().matches(/[a-z]+/, "Password must contain atleast one lowercase alphabet.")
                .matches(/[A-Z]+/, "Password must contain atleast one uppercase alphabet.")
                .matches(/\d+/, "Password must contain atleast one number.")
                .matches(/[@$!%*#?&*()]+/, "Password must contain atleast one special character @$!%*#?&*().")
                .matches(/^[A-Za-z\d@$!%*#?&*()]{8,15}$/, "Password must have minimum 8 characters and maximum 15 characters.")
        },
        {
            title: "Confirm Password",
            name: "password_conf",
            type: "text",
            props: {
                type: "password"
            },
            validationSchema: yup.string()
                .oneOf([yup.ref('new_password')], 'Passwords must match')
        }],
    submitButton: "Change password",
} as const;
type ResetFormData = FormDataShape<typeof resetSchema>;
type ResetInitiateFormData = FormDataShape<typeof resetInitiateSchema>;

export function ResetPassword(): JSX.Element {
    const navigate = useNavigate();
    const [confirmationSent, setConformationSent] = React.useState<boolean>(false);
    const auth = useAuth();
    const emailRef = useRef<string>("");
    const [retrySendCodeCount, setRetrySendCodeCount] = React.useState<number>(0);
    const [codeSentNow, setCodeSentNow] = React.useState<boolean>(false);
    const [retry, setRetry] = React.useState<boolean>(false);
    const {
        seconds,
        minutes,
        isRunning,
        restart,
    } = useTimer({ expiryTimestamp: new Date(), onExpire: () => setCodeSentNow(false), autoStart: false });
    const sendCode = (d: ResetInitiateFormData) => {
        intitiateForgotPassword(d.email, (err: any, data: any) => {
            if (err) {
                if (err.code == "LimitExceededException") {
                    toast.error("Too many tries. Please try after some time.");
                } else
                    toast.error("An error occured");
            } else {
                emailRef.current = d.email;
                toast.success("A conformation code is sent to your email.")
                setConformationSent(true);
                //console.log(data);
            }
        })
    }
    const resetPass = (d: ResetFormData) => {
        confirmPassword(emailRef.current ?? auth?.user?.user_details?.email, d.conformation_code, d.new_password, (err: any, data: any) => {
            if (err) {
                if (err.code == "CodeMismatchException") {
                    setRetry(true)
                    toast.error("Invalid code");
                }

            }
            else {
                toast.success("Successfully changed password.")
                navigate("/")
                //console.log(data);
            }
        })
    }
    React.useEffect(() => {
        if (retrySendCodeCount === 4) {
            toast.error("Too many tries");
            navigate("/");
        }
    }, [retrySendCodeCount])
    return (
        <Layout>
            <h2>Reset password</h2>
            <div style={{ padding: "2em" }}>
                {
                    confirmationSent || auth?.user?.user_details?.email ?
                        <FormGenerator key={1} schema={resetSchema as SchemaType} onError={(e) => console.log(e)}
                            onSubmit={resetPass} />
                        :
                        <FormGenerator key={2} schema={resetInitiateSchema as SchemaType} onError={(e) => console.log(e)}
                            onSubmit={sendCode} />
                }
                {
                    retry ?
                        <div style={{ display: "flex", flexDirection: "row-reverse", marginRight: "8em" }}>
                            <ButtonSolid
                                style={{ padding: "0.5em", backgroundColor: "MenuText", color: "white" }}
                                disabled={codeSentNow} onClick={() => {
                                    setCodeSentNow(true);
                                    setRetrySendCodeCount(retrySendCodeCount + 1);
                                    let t = new Date();
                                    t.setSeconds(t.getSeconds() + 90);
                                    restart(t)
                                    if (retrySendCodeCount !== 3)
                                        sendCode({ email: emailRef.current });
                                }}>{"Resend code" + (isRunning ? "(" + minutes + ":" + seconds + ")" : "")}</ButtonSolid>
                        </div>
                        :
                        null
                }
            </div>
        </Layout>
    );
}