import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormGenerator, { SchemaType } from "../../components/Form/FormGenerator";
import { dataMapReturn, dynamicSchemaGenerator } from "../../components/Form/FormGeneratorHelpers";
import Layout from "../Layout";
import formStyle from '../../components/Form/Form.module.scss';
import { useLazyQuery, useQuery } from "@apollo/client";
import propertyQuery, { IPropertyDetails } from "../../queries/property.query";
import { defaultValueInjector } from "../../components/Form/FormGeneratorHelpers";
import { toast } from "react-toastify";
import * as yup from 'yup';
import { useLoder } from "../../components/Loader";

const stringFieldRequired = yup.string().required("This field is required.")
const schema: SchemaType = {
    heading: "Edit Property",
    items: [
        {
            title: "Change address",
            name: "address",
            type: "addressInput",
            props: {

            },
        },
        {
            title: "Property type",
            name: "type",
            type: "select",
            props: {
                values: {}
            },
            validationSchema: stringFieldRequired
        },
        {
            title: "Property subtype",
            name: "subtype",
            type: "select",
            props: {
                values: {}
            },
            validationSchema: stringFieldRequired
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
            title: "Images",
            name: "images",
            type: "image",
            props: {
                maxFileSize: 5000000,
                resolutionType: 'ratio',
                resolutionWidth: 16,
                resolutionHeight: 9
            }
        },
        {
            title: "Bedroom",
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
                items: {}
            }
        },
        {
            title: "Restrictions",
            name: "restriction",
            type: "checkboxGroup",
            wrapperClassName: formStyle["horizontal-list"],
            props: {
                values: [],
            }
        },
        {
            title: "Lease term",
            name: "lease_term",
            type: "select",
            props: {
                values: { "": "", "snow": "6 Months to 1 year", "lawn": "1 year" }
            },
            validationSchema: stringFieldRequired
        },
        {
            title: "Rent",
            name: "rent",
            type: "text",
            props: {
                type: "number"
            },
            validationSchema: stringFieldRequired
        },



    ],
    submitButton: "Next",

}
export default function EditProperty() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [_schema, _setSchema] = React.useState<SchemaType | null>(null);
    const [Loader, setLoader] = useLoder({});
    let { data: property_types, loading } = useQuery(propertyQuery.GET_ALL_PROPERTY_TYPE_SUBTYPE);
    let [getProperty, { data: propertyData, loading: propertyloading, error }] = useLazyQuery<{ property: IPropertyDetails[] }>(propertyQuery.GET_PROPERTY_BY_ID, { fetchPolicy: "network-only" });
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
        if (loading)
            setLoader(true);

    }, [loading]);
    React.useEffect(() => {
        if (propertyData) {
            console.log(propertyData);
            const property = propertyData.property[0];
            const defaultValue = {
                property_address: property.property_address?.address?.full_address,
                // property_coords: property.coordinates?.coordinates,
                type: property.property_type.id,
                subtype: property.property_subtype.id,
                description: property.description,
                bedroom: property.property_detail?.rooms?.bedroom,
                bathroom: property.property_detail?.rooms?.bathroom,
                parking: property.property_detail?.rooms?.parking,
                features: property.property_detail?.features ?? [],
                restriction: property.property_detail?.restrictions ?? [],
                rent: property.property_detail?.rent_amount
            }
            defaultValueInjector(schema, defaultValue).then(s => {
                console.log("set schema", s);
                dynamicSchemaGenerator({
                    schema: s,
                    dataLoader: {
                        type: property_types.property_type.map((e: any) => { return { [e.id]: e.name } }),
                        subtype: property_types.property_subtype.map((e: any) => { return { [e.id]: e.name } }),
                    },
                    dataMap: (data) => {
                        return {
                            images: (item: any) => {
                                console.log(property.property_images?.map(e => { return { url: e?.s3Url, name: e?.key } }))
                                item.props.fetchList = property.property_images ? property.property_images.map(e => { return { url: e?.s3Url?.url, name: e?.key } }) : []
                            },
                            address: (item: any) => {
                                item.info = "Current address: " + property.property_address?.address?.full_address;
                            },
                            type: (item: any) => {
                                item.props.values = {
                                    "": "", ...data.type.reduce((obj: any, curr: any) => {
                                        obj = { ...obj, ...curr }
                                        return obj;
                                    }, {})
                                };
                            },


                            subtype: (item: any) => {
                                item.props.values = {
                                    "": "", ...data.subtype.reduce((obj: any, curr: any) => {
                                        obj = { ...obj, ...curr }
                                        return obj;
                                    }, {})
                                };
                            },
                        }
                    }
                }).then(sch => {
                    setLoader(false);
                    _setSchema(sch)
                })
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