import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormGenerator, { SchemaType } from "../components/Form/FormGenerator";
import { dataMapReturn, dynamicSchemaGenerator } from "../components/Form/FormGeneratorHelpers";
import Layout from "./Layout";
const schema: SchemaType = {
    heading: "Add Property",
    items: [
        {
            title: "Property name",
            name: "property_name",
            type: "text",
            props: {
                type: "text"
            }
        },
        {
            title: "Property address",
            name: "property_address",
            type: "text",
            props: {
                type: "text"
            }
        },
        {
            title: "Property location",
            name: "property_coords",
            type: "coordinateInput",
            props: {
                center: [55.731538, -103.650174],
                zoom: 4
            }
        },
        {
            title: "Images",
            name: "images",
            type: "image",
            props: {
                resolutionType: 'ratio',
                resolutionWidth: 16,
                resolutionHeight: 9
            }
        },
        {
            title: "Property type",
            name: "type",
            type: "select",
            props: {
                values: { "-": "", "1": "Detatched", "2": "Lawn moving" }
            }
        },
        {
            title: "Property subtype",
            name: "subtype",
            type: "select",
            props: {
                values: { "-": "", "snow": "Main level", "lawn": "Basement" }
            }
        },
        {
            title: "Additional notes:",
            name: "notes",
            type: "textarea",
            props: {
                rows: 10
            }
        },
        {
            title: "bedroom",
            name: "bedroom",
            type: "number",
            props: {
                min: 1,
                max: 10
            }
        },
        {
            title: "Bathroom",
            name: "bathroom",
            type: "number",
            props: {
                min: 1,
                max: 10
            }
        },
        {
            title: "Maximum occupants",
            name: "tenant_count",
            type: "number",
            props: {
                min: 1,
                max: 10
            }
        },
        {
            title: "Parking",
            name: "parking",
            type: "number",
            props: {
                min: 0,
                max: 6
            }
        },
        {
            title: "Features and amenities",
            name: "features",
            type: "pillList",
            props: {
                items: {
                    fridge: "Fridge", stove: "Stove", dishwasher: "Dishwasher", microwave: "Microwave",
                    nosmoking: "No smoking", stove2: "Stove"
                }
            }
        },
        {
            title: "Pets",
            name: "pets",
            type: "select",
            props: {
                values: { "-": "", "yes": "Yes", "no": "No" }
            }
        },
        {
            title: "Smoking",
            name: "smoking",
            type: "select",
            props: {
                values: { "-": "", "yes": "Yes", "no": "No" }
            }
        },
        {
            title: "Rent",
            name: "rent",
            type: "text",
            props: {
                type: "number"
            }
        },
        {
            title: "Lease term",
            name: "lease_term",
            type: "select",
            props: {
                values: { "-": "", "snow": "6 Months to 1 year", "lawn": "1 year" }
            }
        },
        { //checkbox group
            title: "Paid by landlord",
            name: "landlord_paid",
            type: "checkboxGroup",
            props: {
                values: ["Hydro", "Water", "Heat"]
            }
        },
        {
            title: "Hydro percentage",
            name: "hydo",
            type: "text",
            props: {
                type: "number"
            }
        },
        {
            title: "Outdoor maintainance",
            name: "outdoor_maintainance",
            type: "select",
            props: {
                values: { "-": "", "yes": "Yes", "no": "No" }
            }
        },
        {
            title: "Address verification document",
            name: "address_proof",
            type: "file",
            props: {
                multiple: true
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
                    title: "Property type",
                    name: "type",
                    type: "select",
                    props: {
                        values: { "-": "", "1": "Detatched", "2": "Lawn moving" }
                    },
                    defaultValue: "abc"
                },
            ]
        },


    ],
    submitButton: "Next",
    defaultValue: {
        property_name: "hello",
        property_coords: [10, 10]
    }
}
export default function EditProperty() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    React.useEffect(() => {
        // dynamicSchemaGenerator({
        //         schema: schema,
        //         dataLoader: schema.defaultValue,
        //         dataMap: (data) => [
        //             {
        //                 "*": (item: any) => {
        //                     if (item.props)
        //                         item.props.defaultValue = data[item.name]
        //                 }
        //             }
        //         ]
        //     }).then(s => {
        //         console.log("set schema", schema === s);
        //         _setSchema(s);
        //     })
        if (!searchParams.get("id"))
            navigate("/")
    }, []);
    return <Layout>
        <FormGenerator schema={schema} onSubmit={(d) => console.log(d)} />

    </Layout>
}