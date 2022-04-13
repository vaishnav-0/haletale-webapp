import React from 'react';
import style from './Form.module.scss';
import Layout from './Layout';
import FormGenerator, { SchemaType, FormDataShape } from '../components/Form/FormGenerator';
import * as yup from 'yup';
import auth from '../functions/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { setGlobalLoader } from '../components/Loader';
import { stringFieldRequired } from '../components/Form/yupSchemas';
const DOBMax = new Date();
DOBMax.setFullYear(DOBMax.getFullYear() - 15);
const schema = {
    heading: "Sign Up",
    items: [
        {
            title: "First name",
            name: "firstname",
            type: "text",
            props: {
                type: "text"
            },
            validationSchema: stringFieldRequired
        },
        {
            title: "Last name",
            name: "lastname",
            type: "text",
            props: {
                type: "text"
            },
            validationSchema: stringFieldRequired
        },
        {
            title: "Email",
            name: "email",
            type: "text",
            props: {
                type: "text"
            },
            validationSchema: stringFieldRequired,
            valueTransform:(v:string)=>v.toLowerCase()
        },
        {
            title: "Date of birth",
            name: "dob",
            type: "time",
            props: {
                type: "date",
                max: "9999-12-31"

            },
            validationSchema: yup.date().typeError("Invalid date").required("Date of birth is required").max(DOBMax, "You should be atleast 15 to sign up on our platform")
        },
        {
            name: "gender",
            type: "radioGroup",
            wrapperClassName: style["horizontal-list"],
            validationSchema: yup.string().required().nullable(),
            props: {
                values: { male: "Male", female: "Female", other: "Other" }
            }
        },
        {
            title: "Password",
            name: "password",
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
                .oneOf([yup.ref('password')], 'Passwords must match')
        },
        {
            name: "TCagree",
            type: "checkbox",
            wrapperRender: (C: JSX.Element) => <div style={{ display: "flex" }}>
                {C}
                <div>
                    By creating your account you agree to our <a onClick={() => window.open('https://haletale.com/terms-and-conditions/', '_blank')} style={{ textDecoration: "underline" }}>terms and condtions</a>
                </div>
            </div>,
            props: {
            },
            validationSchema: yup.boolean().oneOf([true], "You haven't agreed to the terms and conditions.")
        }],
    submitButton: "Sign Up",
} as const;
type FormData = FormDataShape<typeof schema>;
//type Extractor<T extends sch["items"]> = T extends any?T["name"] 
function Signup(): JSX.Element {
    const [disabled, setDisabled] = React.useState<boolean>(false);
    const navigate = useNavigate();
    const signUpCallback = (err: Error | null, data?: any): void => {
        if (!err) {
            setDisabled(true);
            console.log(data);
            if (data.CodeDeliveryDetails) {
                setGlobalLoader(true, { spinner: false });
                toast.success('A confirmation link has been sent to your email.', {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    onClose: () => { navigate("/"); setGlobalLoader(false) }
                });
            }
        }
        else {
            console.log(err.name);
            if (err.name === 'UsernameExistsException')
                toast.error('User already exist', {
                    position: "bottom-center",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
        }
    }
    const onSubmit = (d: FormData) => {
        auth.emailPasswordSignUp({ email: d.email, password: d.password, name: d.firstname }, signUpCallback);
    }
    return (
        <Layout>
            <FormGenerator schema={schema as SchemaType} onError={(e) => console.log(e)}
                onSubmit={onSubmit} disabled={disabled} />
        </Layout>
    );
}

export default Signup;