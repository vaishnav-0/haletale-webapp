import React from "react";
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';
import FormGenerator, { FormDataShape, SchemaType } from "../components/Form/FormGenerator";
import Layout from "./Layout";

const schema = {
    heading: "Change password",
    items: [
        {
            title: "Old password",
            name: "old_password",
            type: "text",
            props: {
                type: "password"
            },
            validationSchema: yup.string().required("Enter your old password")
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
type FormData = FormDataShape<typeof schema>;

export function ChangePassword(): JSX.Element {
    const [disabled, setDisabled] = React.useState<boolean>(false);
    const navigate = useNavigate();
    const onSubmit = (d: FormData) => {
        //auth.emailPasswordSignUp({ email: d.email, password: d.password, name: d.firstname }, signUpCallback);
    }
    return (
        <Layout>
            <FormGenerator schema={schema as SchemaType} onError={(e) => console.log(e)}
                onSubmit={onSubmit} disabled={disabled} />
        </Layout>
    );
}