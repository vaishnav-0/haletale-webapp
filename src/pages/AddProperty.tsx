import React from 'react';
import Layout from './Layout';
import FormGenerator from '../components/Form/FormGenerator';
import { SchemaType } from '../components/Form/FormGenerator';
import formStyle from '../components/Form/Form.module.scss';
import * as yup from 'yup';
import propertyMutation from '../queries/property.mutation'
import { FormDataShape } from '../components/Form/FormGenerator';
import Searchbar from '../components/Searchbar';
import { PropertyQuery } from '../queries'
import { useQuery, useMutation } from '@apollo/client';
import propertyQuery from '../queries/property.query';
import { useLoder } from '../components/Loader';
import { cropToAspectRatio } from '../components/Form/components/Images';
import { dataMapReturn, dynamicSchemaGenerator } from '../components/Form/FormGeneratorHelpers';
import { usePlaceSuggestions } from '../functions/hooks/usePlaceSuggestions';
import { UseFormReturn } from 'react-hook-form';
import { addressToGeo } from '../functions/api/location';
import { ButtonSolid } from '../components/Button';
import ProgressiveForm from '../components/Form/ProgressiveForm';


import { handleImage } from '../functions/api/imageUpload'

type FormPropsType = {
    onComplete: () => void,
    onLoading: () => void
}
function AddPropertyForm1(props: FormPropsType) {
    const [Loader, setLoader] = useLoder({ backgroundColor: "#000000a3" });
    const [schema_, setSchema_] = React.useState<SchemaType | null>(null);
    const [disabled, setDisabled] = React.useState<boolean>(false)
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
                validationSchema: yup.string().required("Property name is required")
            },
            {
                name: "address_search",
                type: "custom",
                render: function PlaceSuggest(f: UseFormReturn) {
                    const { suggestions, suggest } = usePlaceSuggestions();
                    return <Searchbar suggestionItems={suggestions.map(e => e[0])}
                        placeholder="Search a place"
                        onChange={suggest}
                        onSubmit={(v, i) => {
                            f.setValue("property_address", v);
                            dynamicSchemaGenerator({
                                schema: schema as SchemaType,
                                dataLoader: addressToGeo(suggestions[i!][1]).then(d => {
                                    return ([d.location.lat, d.location.lng])
                                }).catch(e => {
                                    console.log(e);
                                })
                                ,
                                dataMap: (data) => [
                                    {
                                        property_coords: (item: any) => { item.props.coords = data },
                                    }
                                ] as dataMapReturn
                            }).then(sch => {
                                setSchema_(sch)
                            })
                        }}
                        submitOnSuggestionClick />
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
                title: "Property type",
                name: "type",
                type: "select",
                props: {
                    values: {}
                }
            },
            {
                title: "Property subtype",
                name: "subtype",
                type: "select",
                props: {
                    values: {}
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
        ],
        submitButton: "Next",
    } as const;

    React.useEffect(() => {
        setSchema_(schema as SchemaType);
    }, [])

    type FormData = FormDataShape<typeof schema>;

    let { data: property_types, loading } = useQuery(propertyQuery.GET_ALL_PROPERTY_TYPE_SUBTYPE);

    const [addProperty, { data, loading: w, error }] = useMutation(propertyMutation.ADD_PROPERTY);

    const onSubmit = (d: FormData) => {
        setDisabled(true)
        console.log(d)
        addProperty({
            variables: {
                coordinates: {
                    "type": "Point",
                    "coordinates": d.property_coords
                },
                name: d.property_name,
                description: d.notes,
                type: d.type,
                sub_type: d.subtype
            }
        })
        props.onLoading();
        setTimeout(() => { props.onComplete() }, 3000);
    }

    // add property res
    if (error) console.log(error)
    if (data) console.log(data)
    React.useEffect(() => {
        if (!loading) {
            dynamicSchemaGenerator({
                schema: schema as SchemaType,
                dataLoader: new Promise(res => res(
                    {
                        type: property_types.property_type.map((e: any) => e.name),
                        subtype: property_types.property_subtype.map((e: any) => e.name),
                    })),
                dataMap: (data) => [
                    {
                        type: (item: any) => { item.props.values = data.type; console.log(item, data) },
                    },
                    {
                        subtype: (item: any) => { item.props.values = data.subtype },
                    }
                ] as dataMapReturn
            }).then(sch => {
                setSchema_(sch)
            })
        }
    }, [loading]);
    React.useEffect(() => {
        if (loading || !schema_) {
            setLoader(true);
        } else {
            setLoader(false)
        }
    }, [loading, schema_])

    return (
        <>
            {
                schema_ && <div style={{ height: "max-content", position: "relative", padding: "1em 0" }}>
                    {Loader}
                    <FormGenerator schema={schema_ as SchemaType} onError={(e) => console.log(e)}
                        onSubmit={onSubmit} disabled={disabled} />
                </div>

            }
        </ >
    );
}
function AddPropertyForm2(props: FormPropsType) {
    const [Loader, setLoader] = useLoder({ backgroundColor: "000000a3" });
    const [schema_, setSchema_] = React.useState<SchemaType | null>(null);
    const schema = {
        heading: "",
        items: [
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
                name: "upload_button",
                type: "custom",
                render: function PlaceSuggest(f: UseFormReturn) {
                    return <ButtonSolid onClick={() => {
                        const images = f.getValues("images");
                        //upload and set images prop to disabled
                        // setSchema_(schema => {
                        //     if (schema)
                        //         (schema.items[0] as any).props.disabled = true;//beware of the index of items
                        //     return schema;
                        // })
                        dynamicSchemaGenerator({//disable image input
                            schema: schema as SchemaType,
                            dataLoader: new Promise(res => res(true)),
                            dataMap: (data) => [{ images: (item: any) => { item.props.disabled = data } }] as dataMapReturn
                        }).then(sch => {
                            setSchema_(sch)
                        })
                    }}>
                        Upload Images
                    </ButtonSolid>
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
                title: "Outdoor maintainance",
                name: "outdoor_maintainance",
                type: "select",
                props: {
                    values: { "-": "", "yes": "Yes", "no": "No" }
                }
            },
        ],
        submitButton: "Next",
    } as const;

    React.useEffect(() => {
        setSchema_(schema as SchemaType);
    }, [])

    type FormData = FormDataShape<typeof schema>;

    const [addImages, { data, loading: w, error }] = useMutation(propertyMutation.ADD_PROPERTY_IMAGES);

    const onSubmit = async (d: FormData) => {
        let imageVariable: { key: string, property_id: string }[];
        // add property id
        let propertyId = 'xyz'
        let keys = await handleImage(d.images);
        keys.forEach((x) => {
            imageVariable.push({
                key: x,
                property_id: propertyId
            })
        })
        addImages({
            variables: {
                object: imageVariable!
            }
        })

    }

    // add property res
    // if (error) console.log(error)
    // if (data) console.log(data)
    // if (loading) console.log(loading)

    // React.useEffect(() => {
    //     if (!loading) {
    //     }
    // }, [loading]);
    // React.useEffect(() => {
    //     if (loading || !schema_) {
    //         setLoader(true);
    //     } else {
    //         setLoader(false)
    //     }
    // }, [loading, schema_])

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
function AddPropertyForm3(props: FormPropsType) {
    const [Loader, setLoader] = useLoder({ backgroundColor: "000000a3" });
    const [schema_, setSchema_] = React.useState<SchemaType | null>(null);
    const schema = {
        heading: "",
        items: [
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
                wrapperClassName: formStyle["horizontal-list"],
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
                title: "Address verification document",
                name: "address_proof",
                type: "file",
                props: {}
            },
        ],
        submitButton: "Next",
    } as const;

    React.useEffect(() => {
        setSchema_(schema as SchemaType);
    }, [])

    type FormData = FormDataShape<typeof schema>;


    const [addPropertyDetails, { data, loading: w, error }] = useMutation(propertyMutation.ADD_PROPERTY_DETAILS);

    const onSubmit = (d: FormData) => {
        console.log(d);
        
        addPropertyDetails({
            variables: {
                description: "desc",
                features: [],
                max_occupants: 5,
                rent_amount: 100.00,
                restrictions: [],
                rooms: {},
                id: "propertyid"
            }
        })
    }

    // add property res
    // if (error) console.log(error)
    // if (data) console.log(data)
    // if (loading) console.log(loading)

    // React.useEffect(() => {
    //     if (!loading) {
    //     }
    // }, [loading]);
    // React.useEffect(() => {
    //     if (loading || !schema_) {
    //         setLoader(true);
    //     } else {
    //         setLoader(false)
    //     }
    // }, [loading, schema_])

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

    const forms = [{ description: "Basic details", component: AddPropertyForm1 }, { description: "Images", component: AddPropertyForm2 }, { description: "Details", component: AddPropertyForm3 }]
    return (
        <Layout>
            <div className={formStyle["form-header"]}>
                Add Property
            </div>
            <ProgressiveForm forms={forms} parallel />
        </Layout >
    );

}

export default AddProperty;