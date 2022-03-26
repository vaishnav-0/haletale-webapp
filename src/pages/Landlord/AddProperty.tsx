import React from 'react';
import Layout from '../Layout';
import FormGenerator from '../../components/Form/FormGenerator';
import { SchemaType } from '../../components/Form/FormGenerator';
import formStyle from '../../components/Form/Form.module.scss';
import * as yup from 'yup';
import propertyMutation from '../../queries/property.mutation'
import { FormDataShape } from '../../components/Form/FormGenerator';
import Searchbar from '../../components/Searchbar';
import { PropertyQuery } from '../../queries'
import { useQuery, useMutation } from '@apollo/client';
import propertyQuery, { IPropertyAttribute } from '../../queries/property.query';
import { useLoader } from '../../components/Loader';
import { cropToAspectRatio } from '../../components/Form/components/Images';
import { dataMapReturn, dynamicSchemaGenerator } from '../../components/Form/FormGeneratorHelpers';
import { usePlaceSuggestions } from '../../functions/hooks/usePlaceSuggestions';
import { UseFormReturn } from 'react-hook-form';
import { addressToGeo } from '../../functions/api/location';
import { ButtonSolid } from '../../components/Button';
import ProgressiveForm from '../../components/Form/ProgressiveForm';
import { handleImage } from '../../functions/api/imageUpload'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const stringFieldRequired = yup.string().required("This field is required.")

type FormPropsType = {
    onComplete: () => void,
    onLoading: (s?: boolean) => void
}

const propertyId: { current: null | string } = { current: null };
function AddPropertyForm1(props: FormPropsType) {
    const schema = {
        heading: "",
        items: [
            {
                title: "Property name",
                name: "property_name",
                type: "text",
                props: {
                    type: "text",
                },
                validationSchema: stringFieldRequired
            },
            {
                title: "Address",
                name: "address",
                type: "addressInput",
                props: {

                },
                validationSchema: yup.object().typeError("Address is required").required("Address is required")
            },
            {
                title: "Property type",
                name: "type",
                type: "select",
                props: {
                    values: {}
                },
                validationSchema: yup.number().required("Type is required").positive("Type is required").typeError("Type is required")
            },
            {
                title: "Property subtype",
                name: "subtype",
                type: "select",
                props: {
                    values: {}
                },
                validationSchema: yup.number().required("Sub type is required").positive("Sub type is required").typeError("Sub type is required")
            },
            {
                title: "Additional notes:",
                name: "notes",
                type: "textarea",
                props: {
                    rows: 10
                }
            },
        ],
        submitButton: "Next",
    } as const;
    const [Loader, setLoader] = useLoader({ backgroundColor: "#000000a3" });
    const [schema_, setSchema_] = React.useState<SchemaType | null>(schema as SchemaType);

    const [disabled, setDisabled] = React.useState<boolean>(false);
    const addressRef = React.useRef<any>({});


    type FormData = FormDataShape<typeof schema>;

    let { data: property_types, loading } = useQuery(propertyQuery.GET_ALL_PROPERTY_TYPE_SUBTYPE);

    const [addProperty, { data, loading: MutationLoading, error }] = useMutation(propertyMutation.ADD_PROPERTY);
    const [addPropertyAddress, { data: PropAddData, loading: PropAddMutationLoading, error: PropAddErr }] = useMutation(propertyMutation.ADD_PROPERTY_ADDRESS);

    React.useEffect(() => {
        if (MutationLoading) {
            props.onLoading();
        } else if (data) {
            propertyId.current = data.insert_property_owner.returning[0].property_id;
            addPropertyAddress({
                variables: {
                    property_id: propertyId.current,
                    ...addressRef.current.addressComponents
                }

            })
        }
    }, [data, MutationLoading]);
    React.useEffect(() => {
        if (PropAddData) {
            props.onComplete();
        }
    }, [PropAddData])
    const onSubmit = (d: FormData) => {
        setDisabled(true);
        addressRef.current = d.address;
        console.log(d);
        addProperty({
            variables: {
                coordinates: {
                    "type": "Point",
                    "coordinates": d.address?.coords
                },
                name: d.property_name,
                description: d.notes,
                type: d.type,
                sub_type: d.subtype,
            }
        })
    }

    // add property res
    if (error) console.log(error)
    React.useEffect(() => {
        if (!loading) {
            dynamicSchemaGenerator({
                schema: schema as SchemaType,
                dataLoader: new Promise(res => res(
                    {
                        type: property_types.property_type.map((e: any) => { return { [e.id]: e.name } }),
                        subtype: property_types.property_subtype.map((e: any) => { return { [e.id + ""]: e.name } }),
                    })),
                dataMap: (data) => {
                    return {
                        type: (item: any) => {
                            item.props.values = {
                                "0": "", ...data.type.reduce((obj: any, curr: any) => {
                                    obj = { ...obj, ...curr }
                                    return obj;
                                }, {})
                            };
                            console.log(item.props.values)
                        },


                        subtype: (item: any) => {
                            item.props.values = {
                                "0": "", ...data.subtype.reduce((obj: any, curr: any) => {
                                    obj = { ...obj, ...curr }
                                    return obj;
                                }, {})
                            };
                        },
                    }
                }
            }).then(sch => {
                console.log(sch)
                setLoader(false)
                setSchema_(sch)
            })
        }
    }, [loading]);
    React.useEffect(() => {
        if (loading)
            setLoader(true);
    }, [loading]);
    return (
        <>
            <div style={{ height: schema_ ? "max-content" : "60em", position: "relative", padding: "1em 0" }}>
                {Loader}
                {schema_ && <FormGenerator schema={schema_ as SchemaType} onError={(e) => console.log(e)}
                    onSubmit={onSubmit} disabled={disabled}
                />
                }
            </div>
        </ >
    );
}
function AddPropertyForm2(props: FormPropsType) {
    const [disabled, setDisabled] = React.useState<boolean>(false);
    const schema = {
        heading: "",
        items: [
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
        ],
        submitButton: "Next",
    } as const;

    type FormData = FormDataShape<typeof schema>;

    const [addImages, { data, loading: mutationLoading, error }] = useMutation(propertyMutation.ADD_PROPERTY_IMAGES);
    React.useEffect(() => {
        if (data) {
            props.onComplete();
        }
    }, [data])
    const onSubmit = async (d: FormData) => {
        if (!propertyId.current) //handle it
            return
        setDisabled(true);
        props.onLoading();
        cropToAspectRatio(d.images, 16 / 9).then(async t => {
            try {
                let keys = await handleImage(d.images);
                const imageVariable = keys.map((x: string) => {
                    return {
                        key: x,
                        property_id: propertyId.current
                    }
                });

                addImages({
                    variables: {
                        object: imageVariable
                    }
                })

            } catch (e) {
                console.log(e);
                setDisabled(false);
                props.onLoading(false);
            }
        }).catch(e => {
            console.log(e)
            setDisabled(false);
            props.onLoading(false);
        })

    }



    return (

        <FormGenerator schema={schema as SchemaType} onError={(e) => console.log(e)}
            disabled={disabled}
            onSubmit={onSubmit} />
    );
}
function AddPropertyForm3(props: FormPropsType) {
    const [Loader, setLoader] = useLoader({ backgroundColor: "000000a3" });
    let { data: property_attributes, loading } = useQuery<IPropertyAttribute>(propertyQuery.PROPERTY_ATTRIBUTES);
    React.useEffect(() => {
        if (loading)
            setLoader(true);
    }, [loading]);
    const [schema_, setSchema_] = React.useState<SchemaType | null>(null);
    const schema = {
        heading: "",
        items: [
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
                name: "utilites",
                isArray: {
                    controlHeading: "",
                    title: "Utilities",
                    static: true,
                },
                items: [
                    {
                        name: "hydro",
                        type: "select",
                        props: {
                            values: {
                                "": "Paid by", "Landlord": "Landlord", "Tenant": "Tenant"
                            }
                        },
                        defaultValue: "",
                        isOptional: {
                            title: "Hydro",
                            default: false,
                        },
                        validationSchema: yup
                            .string()
                            .when("hydro_provided", {
                                is: true,
                                then: yup.string().required("This field is required")
                            })
                    },
                    {
                        name: "water",
                        type: "select",
                        props: {
                            values: {
                                "": "Paid by", "Landlord": "Landlord", "Tenant": "Tenant"
                            }
                        },
                        defaultValue: "",
                        isOptional: {
                            title: "Water",
                            default: false
                        },
                        validationSchema: yup
                            .string()
                            .when("water_provided", {
                                is: true,
                                then: yup.string().required("This field is required")
                            })
                    },
                    {
                        name: "heat",
                        type: "select",
                        props: {
                            values: {
                                "": "Paid by", "Landlord": "Landlord", "Tenant": "Tenant"
                            }
                        },
                        defaultValue: "",
                        isOptional: {
                            title: "Heat",
                            default: false
                        },
                        validationSchema: yup
                            .string()
                            .when("heat_provided", {
                                is: true,
                                then: yup.string().required("This field is required")
                            })
                    },
                ],

            },
            {
                title: "Lease term",
                name: "lease_term",
                type: "select",
                props: {
                    values: { "": "", "snow": "6 Months to 1 year", "lawn": "1 year" }
                },
                validationSchema: yup.number().positive("Lease term is required")
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
    } as const;

    React.useEffect(() => {
        if (property_attributes && !loading) {
            dynamicSchemaGenerator({
                schema: schema as SchemaType,
                dataLoader: new Promise(res => res(
                    {
                        features: property_attributes?.property_features_list.map((e: any) => e.name),
                        restriction: property_attributes?.property_restrictions_list.map((e: any) => e.name),
                        lease_term: property_attributes?.lease_term_list,
                    })),
                dataMap: (data) => {
                    return {
                        features: (item: any) => { item.props.items = data.features },
                        restriction: (item: any) => { item.props.values = data.restriction },
                        lease_term: (item: any) => {
                            item.props.values = {
                                "0": "", ...data.lease_term.reduce((obj: any, curr: any) => {
                                    obj = { ...obj, ...{ [curr.id]: curr.description } }
                                    return obj;
                                }, {})
                            }
                        }
                    }
                }
            }).then(sch => {
                console.log(sch)
                setLoader(false)
                setSchema_(sch)
            })
        }
    }, [loading, property_attributes])

    type FormData = FormDataShape<typeof schema>;


    const [addPropertyDetails, { data, loading: mutationLoading, error }] = useMutation(propertyMutation.ADD_PROPERTY_DETAILS);
    React.useEffect(() => {
        if (data) {
            props.onComplete();
        }
    }, [data])
    const onSubmit = (d: FormData) => {
        console.log(d);
        // props.onLoading();
        // if (!propertyId.current) //handle it
        //     return
        // addPropertyDetails({
        //     variables: {
        //         features: d.features,
        //         max_occupants: d.tenant_count,
        //         rent_amount: d.rent,
        //         restrictions: d.restriction,
        //         lease_term: d.lease_term,
        //         rooms: { bedroom: d.bedroom, bathroom: d.bathroom, parking: d.parking },
        //         id: propertyId.current
        //     }
        // })
    }
    return (
        <>
            {Loader}
            {
                schema_ &&
                <FormGenerator schema={schema_ as SchemaType} onError={(e) => console.log(e)}
                    onSubmit={onSubmit} />
            }
        </ >
    );
}
function AddProperty(): JSX.Element {
    const navigate = useNavigate();
    React.useEffect(() => {
        propertyId.current = null;
    }, [])
    const forms = [{ description: "Basic details", component: AddPropertyForm1 }, { description: "Images", component: AddPropertyForm2 }, { description: "Details", component: AddPropertyForm3 }]
    return (
        <Layout>
            <div className={formStyle["form-header"]}>
                Add Property
            </div>
            <ProgressiveForm forms={forms} onFinish={() => {
                toast.success("Property added");
                navigate("/landlord/dashboard");
            }}
                parallel
            />
        </Layout >
    );

}

export default AddProperty;