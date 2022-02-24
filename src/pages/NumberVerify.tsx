
import React from "react"
import Layout from "./Layout"
import FormGenerator, { SchemaType } from "../components/Form/FormGenerator"
import * as yup from 'yup';
import { text } from "stream/consumers";
export function NumberVerify(): JSX.Element {
    return (
        <Layout footer={true}>
            <FormGenerator schema={{
                heading: "Verify phone number",
                items: [
                    {
                        name: "country_code",
                        type: "select",
                        props: {
                            values: {}
                        }
                    },
                    {
                        name: "phone_number",
                        type: "text",
                        props: {
                            type: "text"
                        },
                        validationSchema: yup.string().matches(/\d+/, "Phone number must only contain numbers").min(10, "Less than 10 digits")
                    }
                ],
                submitButton: "Send OTP",
                wrapperStyle: { display: "flex", gap: "1em", justifyContent: "center", alignItems: "center" }
            }}
                onSubmit={(d) => {
                    console.log(d);
                }}
            />
        </Layout>
    )
}