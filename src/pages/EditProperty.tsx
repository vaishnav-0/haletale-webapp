import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormGenerator, { SchemaType } from "../components/Form/FormGenerator";
import { dataMapReturn, dynamicSchemaGenerator } from "../components/Form/FormGeneratorHelpers";
import Layout from "./Layout";
import formStyle from '../components/Form/Form.module.scss';
import { useLazyQuery } from "@apollo/client";
import propertyQuery, { IPropertyDetails } from "../queries/property.query";
import axios from "axios";
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
            title: "Restrictions",
            name: "restriction",
            type: "checkboxGroup",
            wrapperClassName: formStyle["horizontal-list"],
            props: {
                values: ["smoking", "pets"],
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
                    title: "name",
                    name: "memberName",
                    type: "text",
                    props: {
                        type: "text"
                    },
                    defaultValue: ""
                }
            ]
        },


    ],
    submitButton: "Next",

}
export default function EditProperty() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [_schema, _setSchema] = React.useState<SchemaType | null>(null);

    let [getProperty, { data: propertyData, loading: propertyloading, error }] = useLazyQuery<{ property: IPropertyDetails[] }>(propertyQuery.GET_PROPERTY_BY_ID);
    const navigate = useNavigate();
    React.useEffect(() => {
        if (!searchParams.get("id"))
            navigate("/")
        else {
            getProperty({
                variables: {
                    id: searchParams.get("id")
                }
            })
        }
    }, []);
    React.useEffect(() => {
        if (propertyData) {
            console.log(propertyData);
            const property = propertyData.property[0];

            const toDataURL = (url: string) => fetch(url, { mode: "cors" })
                .then(response => { console.log(response.body); return response.blob(); })
                .then(blob => new Promise((resolve, reject) => {
                    var file = new File([blob], property.property_images![0]?.key ?? "");
                    const reader = new FileReader()
                    reader.onloadend = () => resolve([reader.result, file])
                    reader.onerror = reject
                    reader.readAsDataURL(blob)
                })).catch(e => {
                    console.log(e)
                })
            toDataURL(property.property_images![0]!.s3Url?.url ?? "").then((data: any) => {
                const fileList = [
                    {
                        dataUrl: data[0],
                        file: data[1]
                    }
                ];
                console.log(fileList)
                const defaultValue = {
                    property_name: property.name,
                    property_address: property.property_address?.address?.full_address,
                    // property_coords: property.coordinates?.coordinates,
                    //type: property.type,
                    type: "2",
                    subtype: property.sub_type,
                    features: ["fridge"],
                    bathroom: 5,
                    restriction: ["pets"],
                    images: fileList,
                    member: [
                        {
                            memberName: "abc"
                        },
                        {
                            memberName: "bgs"
                        }
                    ]
                }
                dynamicSchemaGenerator({
                    schema: schema,
                    dataLoader: defaultValue,
                    dataMap: (data) => [
                        {
                            "*": (item: any) => {
                                console.log(data[item.name], item.name, item.isArray)
                                if (data[item.name]) {
                                    if (item.isArray) {
                                        console.log(item, "yeyeyey")
                                        item.defaultValue = data[item.name]
                                    }
                                    else if (item.props)
                                        item.props.defaultValue = data[item.name]
                                }

                            }
                        }
                    ]
                }).then(s => {
                    console.log("set schema", s);
                    _setSchema(s)
                })
                console.log(defaultValue)
            })


        }
    }, [propertyData]);
    React.useEffect(() => {
        console.log(error);
        if (error)
            navigate("/");
    }, [error])
    return <Layout>
        {_schema &&
            <FormGenerator schema={_schema} onSubmit={(d) => console.log(d)} />
        }
    </Layout>
}