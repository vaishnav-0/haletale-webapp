import React from 'react';
import style from './Form.module.scss';
import Layout from './Layout';
import FormGenerator, { SchemaType, FormDataShape } from '../components/Form/FormGenerator';
import * as yup from 'yup';
import auth from '../functions/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { setGlobalLoader } from '../components/Loader';
//Example
// const testSchema: SchemaType = {
//     heading: "Sign Up",
//     items: [
//         {
//             title: "First name",
//             name: "firstname",
//             type: "text",
//             props: {
//                 type: "text"
//             },
//             validationSchema: yup.string().required()
//         },
//         {
//             title: "Last name",
//             name: "lastname",
//             type: "text",
//             props: {
//                 type: "text"
//             },
//             validationSchema: yup.string().required()
//         },
//         {
//             title: "Email",
//             name: "email",
//             type: "text",
//             props: {
//                 type: "text"
//             },
//             validationSchema: yup.string().email().required()

//         },
//         {
//             title: "Date of birth",
//             name: "dob",
//             type: "time",
//             props: {
//                 type: "date"
//             }
//         },
//         {
//             name: "gender",
//             type: "radioGroup",
//             isOptional: {
//                 title: "Provide",
//                 value: ["Yes", "No"],
//                 default: false,
//                 sectionHeading: "Gender"
//             },
//             wrapperClassname: style["horizontal-list"],
//             validationSchema: yup.string().required(),
//             props: {
//                 values: { male: "Male", female: "Female", other: "Other" }
//             }
//         },
//         {
//             name: "member",
//             isArray: {
//                 controlHeading: "No. of tenants:",
//                 title: "Member"
//             },
//             items: [
//                 {
//                     title: "name",
//                     name: "name",
//                     type: "text",
//                     props: {
//                         type: "text"
//                     },
//                     defaultValue: "asdasd",
//                 },
//                 {
//                     name: "relation",
//                     type: "select",
//                     props: {
//                         values: { 0: "Select Relation", 1: "1", 2: "2" },
//                     },
//                     defaultValue: 2
//                 },
//                 {
//                     name: "add_to_lease",
//                     type: "checkbox",
//                     props: {
//                         label: "Add to lease"
//                     },
//                     defaultValue: true
//                 }
//             ]
//         },
//         {
//             title: "Password",
//             name: "password",
//             type: "text",
//             props: {
//                 type: "password"
//             },
//             validationSchema: yup.string().matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
//         },
//         {
//             title: "Confirm Password",
//             name: "password_conf",
//             type: "text",
//             props: {
//                 type: "password"
//             },
//             validationSchema: yup.string()
//                 .oneOf([yup.ref('password')], 'Passwords must match')
//         },
//         {
//             name: "TCagree",
//             type: "checkbox",
//             wrapperRender: (C) => <div style={{ display: "flex" }}>
//                 {C}
//                 <div>
//                     By creating your account you agree to our <a href='#'>terms and condtions</a>
//                 </div>
//             </div>,
//             props: {
//             }
//         }],
//     submitButton: "Sign Up",
//     onError: (e) => console.log(e),
//     onSubmit: (d) => console.log(d),
// }
// !schema.items[0].isArray && schema.items[0].type:

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
            validationSchema: yup.string().required()
        },
        {
            title: "Last name",
            name: "lastname",
            type: "text",
            props: {
                type: "text"
            },
            validationSchema: yup.string().required()
        },
        {
            title: "Email",
            name: "email",
            type: "text",
            props: {
                type: "text"
            },
            validationSchema: yup.string().email().required()

        },
        {
            title: "Date of birth",
            name: "dob",
            type: "time",
            props: {
                type: "date"
            }
        },
        {
            name: "gender",
            type: "radioGroup",
            wrapperClassname: style["horizontal-list"],
            validationSchema: yup.string().required(),
            props: {
                values: { male: "Male", female: "Female", other: "Other" }
            }
        },
        {
            name: "member",
            isArray: {
                controlHeading: "No. of tenants:",
                title: "Member"
            },
            items: [
                {
                    name: "name",
                    type: "text",
                    props: {
                        type: "text",
                        placeholder: "name",
                    },
                    defaultValue: "",
                    validationSchema: yup.string().required("aa aaaaaaaaaaaaa aaaaa")
                },
                {
                    name: "relation",
                    type: "select",
                    props: {
                        values: { 0: "Select Relation", 1: "1", 2: "2" },
                    },
                    defaultValue: 0
                },
                {
                    name: "add_to_lease",
                    type: "checkbox",
                    props: {
                        label: "Add to lease"
                    },
                    defaultValue: true
                }
            ]
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
                    By creating your account you agree to our <a href='#'>terms and condtions</a>
                </div>
            </div>,
            props: {
            }
        }],
    submitButton: "Sign Up",
} as const;
type FormData = FormDataShape<typeof schema>;
//type Extractor<T extends sch["items"]> = T extends any?T["name"] 
function Signup(): JSX.Element {
    const navigate = useNavigate();
    const signUpCallback = (err: Error | null, data?: any): void => {
        if (!err) {
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
                onSubmit={onSubmit} />
        </Layout>
    );
}

export default Signup;