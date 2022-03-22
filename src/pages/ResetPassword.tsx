import React, { useRef } from "react";
import { Link, Navigate, useNavigate, } from "react-router-dom";
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
    submitButton: "Sign Up",
} as const;
type ResetFormData = FormDataShape<typeof resetSchema>;
type ResetInitiateFormData = FormDataShape<typeof resetInitiateSchema>;

export function ResetPassword(): JSX.Element {
    const [disabled, setDisabled] = React.useState<boolean>(false);
    const navigate = useNavigate();
    const [confirmationSent, setConformationSent] = React.useState<boolean>(false);
    const auth = useAuth();
    const emailRef = useRef<string>("");
    const [retrySendCode, setRetrySendCode] = React.useState<number>(-1);
    const [codeSentNow, setCodeSentNow] = React.useState<boolean>(false);
    React.useEffect(() => {
        if (codeSentNow)
            setTimeout(() => setCodeSentNow(false), 90);
    }, [codeSentNow])
    const sendCode = (d: ResetInitiateFormData) => {
        intitiateForgotPassword(d.email, (err: any, data: any) => {
            if (err)
                toast.error("An error occured");
            else {
                emailRef.current = d.email;
                toast.success("A conformation code is sent to your email.")
                setConformationSent(true);
                //console.log(data);
            }
        })
    }
    const resetPass = (d: ResetFormData) => {
        confirmPassword(emailRef.current, d.conformation_code, d.new_password, (err: any, data: any) => {
            if (err) {
                if (err.message = "CodeMismatchException")
                    toast.error("Invalid code");
            }
            else {
                toast.success("Successfully changed password.")
                navigate("/")
                //console.log(data);
            }
        })
    }
    return (
        <Layout>
            <h2>Reset password</h2>
            <div style={{ padding: "2em" }}>
                {
                    confirmationSent ?
                        <FormGenerator schema={resetSchema as SchemaType} onError={(e) => console.log(e)}
                            onSubmit={resetPass} disabled={disabled} />
                        :
                        <FormGenerator schema={resetInitiateSchema as SchemaType} onError={(e) => console.log(e)}
                            onSubmit={sendCode} disabled={disabled} />
                }
                {
                    retrySendCode !== -1 ?
                        retrySendCode === 3 ?
                            <Navigate to="/" />
                            :
                            <ButtonSolid disabled={codeSentNow} onClick={() => sendCode({ email: emailRef.current })}></ButtonSolid>
                        :
                        null
                }
            </div>
        </Layout>
    );
}