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
import { toast } from 'react-toastify';

const stringFieldRequired = yup.string().required("This field is required.")

type FormPropsType = {
    onComplete: () => void,
    onLoading: (s?: boolean) => void
}

const propertyId: { current: null | string } = { current: null };
function AddPropertyForm1(props: FormPropsType) {
    const [Loader, setLoader] = useLoder({ backgroundColor: "#000000a3" });
    const [schema_, setSchema_] = React.useState<SchemaType | null>(null);
    const [disabled, setDisabled] = React.useState<boolean>(false);
    const addressRef = React.useRef<any>({});
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
                name: "address_search",
                type: "custom",
                render: function PlaceSuggest(f: UseFormReturn, s: SchemaType) {
                    const { suggestions, suggest } = usePlaceSuggestions();
                    return <Searchbar disabled={disabled} suggestionItems={suggestions.map(e => e[0])}
                        placeholder="Search a place"
                        onChange={suggest}
                        onSubmit={(v, i) => {
                            f.setValue("property_address", v);
                            dynamicSchemaGenerator({
                                schema: s,
                                dataLoader: addressToGeo(suggestions[i!][1]).then(d => {
                                    const addressComponents = ["administrative_area_level_1", "administrative_area_level_2", "country", "locality", "route", "street_number", "postal_code"];
                                    addressRef.current = d.address_components.reduce((obj: any, curr: any) => {
                                        const type = curr.types.find((e: any) => addressComponents.includes(e))
                                        if (type)
                                            obj[type] = curr.long_name;
                                        return obj;
                                    }, {})
                                    addressRef.current.full_address = v;
                                    return ([d.geometry.location.lat, d.geometry.location.lng])
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
                },
                validationSchema: stringFieldRequired
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
        ],
        submitButton: "Next",
    } as const;

    React.useEffect(() => {
        setSchema_(schema as SchemaType);
    }, []);

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
                    ...addressRef.current
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
    }

    // add property res
    if (error) console.log(error)
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
                        type: (item: any) => { item.props.values = ["", ...data.type]; },
                    },
                    {
                        subtype: (item: any) => { item.props.values = ["", ...data.subtype] },
                    }
                ] as dataMapReturn
            }).then(sch => {
                setSchema_(sch)
            })
        }
    }, [loading]);
    React.useEffect(() => {
        if (loading) {
            setLoader(true);
        } else {
            setLoader(false)
        }
    }, [loading])

    return (
        <>
            {
                schema_ && <div style={{ height: "max-content", position: "relative", padding: "1em 0" }}>
                    {Loader}
                    <FormGenerator schema={schema_ as SchemaType} onError={(e) => console.log(e)}
                        onSubmit={onSubmit} disabled={disabled} 
                    />
                </div>

            }
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
    const [Loader, setLoader] = useLoder({ backgroundColor: "000000a3" });
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
                    items: {
                        fridge: "Fridge", stove: "Stove", dishwasher: "Dishwasher", microwave: "Microwave",
                        nosmoking: "No smoking", stove2: "Stove", outdoor_maintainance: "Outdoor maintainance"
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
    } as const;

    React.useEffect(() => {
        setSchema_(schema as SchemaType);
    }, [])

    type FormData = FormDataShape<typeof schema>;


    const [addPropertyDetails, { data, loading: mutationLoading, error }] = useMutation(propertyMutation.ADD_PROPERTY_DETAILS);
    React.useEffect(() => {
        if (data) {
            props.onComplete();
        }
    }, [data])
    const onSubmit = (d: FormData) => {
        props.onLoading();
        if (!propertyId.current) //handle it
            return
        addPropertyDetails({ //lease term to be included
            variables: {
                description: null,
                features: d.features,
                max_occupants: d.tenant_count,
                rent_amount: d.rent,
                restrictions: d.restriction,
                rooms: { bedroom: d.bedroom, bathroom: d.bathroom, parking: d.parking },
                id: propertyId.current
            }
        })
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
    React.useEffect(() => {
        propertyId.current = null;
    }, [])
    const forms = [{ description: "Basic details", component: AddPropertyForm1 }, { description: "Images", component: AddPropertyForm2 }, { description: "Details", component: AddPropertyForm3 }]
    return (
        <Layout>
            <div className={formStyle["form-header"]}>
                Add Property
            </div>
            <ProgressiveForm forms={forms} onFinish={() => {// do stuff
            }} />
        </Layout >
    );

}

export default AddProperty;