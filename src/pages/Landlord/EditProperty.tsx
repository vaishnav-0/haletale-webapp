import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormGenerator, { SchemaType, FormDataShape } from "../../components/Form/FormGenerator";
import { dynamicSchemaGenerator } from "../../components/Form/FormGeneratorHelpers";
import Layout from "../Layout";
import formStyle from '../../components/Form/Form.module.scss';
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import propertyQuery, { IPropertyAttribute, IPropertyDetails } from "../../queries/property.query";
import { defaultValueInjector } from "../../components/Form/FormGeneratorHelpers";
import * as yup from 'yup';
import { useLoader } from "../../components/Loader";
import propertyMutation from "../../queries/property.mutation";
import cloneDeep from "clone-deep";
import { cropToAspectRatio } from "../../components/Form/components/Images";
import { handleImage } from "../../functions/api/imageUpload";
import { imageMutation } from "../../queries";

const utilityList = ["hydro", "water", "heat"]
const stringFieldRequired = yup.string().required("This field is required.")
const schema = {
    heading: "Edit Property",
    items: [
        {
            title: "Property name",
            name: "property_name",
            type: "text",
            props: {
                type: "text",
                disabled: true
            },
        },
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
            name: "utilities",
            isArray: {
                controlHeading: "",
                title: "Utilities",
                static: true,
            },
            items: [
                {
                    name: "hydro",
                    type: "select",
                    title: "Paid by",
                    props: {
                        values: {
                            "": "", "4": "Landlord", "7": "Tenant"
                        }
                    },
                    isOptional: {
                        title: "Hydro",
                        default: false
                    },
                    defaultValue: "",
                    valueTransform: (v: any, opt?: boolean) => ((v === '' || !opt) ? null : { paid_by: v, utility_id: 1 }),

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
                    title: "Paid by",
                    props: {
                        values: {
                            "": "", "4": "Landlord", "7": "Tenant"
                        }
                    },
                    defaultValue: "",
                    valueTransform: (v: any, opt?: boolean) => ((v === '' || !opt) ? null : { paid_by: v, utility_id: 2 }),
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
                    title: "Paid by",
                    props: {
                        values: {
                            "": "", "4": "Landlord", "7": "Tenant"
                        }
                    },
                    defaultValue: "",
                    valueTransform: (v: any, opt?: boolean) => ((v === '' || !opt) ? null : { paid_by: v, utility_id: 3 }),
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
type TFormData = FormDataShape<typeof schema>
export default function EditProperty() {
    const [_schema, _setSchema] = React.useState<SchemaType | null>(null);
    const [Loader, setLoader] = useLoader({});
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [updateProperty, { data: updatePropertyData, loading: updatePropertyLoading, error: updatePropertyError }] = useMutation(propertyMutation.UPDATE_PROPERTY);
    const [deleteImages, { data: deleteImagesData, loading: deleteImagesLoading, error: deleteImagesError }] = useMutation(imageMutation.DELETE_IMAGES);
    const [addImages, { data: addImagesData, loading: addImagesLoading, error: addImagesError }] = useMutation(propertyMutation.ADD_PROPERTY_IMAGES);

    const [getProperty, { data: propertyData, loading: propertyloading, error }] = useLazyQuery<{ property: IPropertyDetails[] }>(propertyQuery.GET_PROPERTY_BY_ID, { fetchPolicy: "network-only" });
    const { data: property_attributes, loading: propertyAttributesLoading } = useQuery<IPropertyAttribute>(propertyQuery.PROPERTY_ATTRIBUTES);
    const { data: property_types, loading: propertyTypesLoading } = useQuery(propertyQuery.GET_ALL_PROPERTY_TYPE_SUBTYPE);
    const property = propertyData?.property[0]

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
        if (propertyloading || propertyTypesLoading || updatePropertyLoading || deleteImagesLoading || addImagesLoading || propertyAttributesLoading)
            setLoader(true);
    }, [propertyloading, propertyTypesLoading, updatePropertyLoading, deleteImagesLoading, addImagesLoading, propertyAttributesLoading]);
    React.useEffect(() => {
        if (updatePropertyData && addImagesData && deleteImagesData) {
            setLoader(false);
            navigate("/landlord/dashboard");
        }
    }, [updatePropertyData, addImagesData, deleteImagesData])
    React.useEffect(() => {
        if (propertyData && property_attributes && property_types) {
            const property = propertyData.property[0];
            const defaultValue = {
                property_name: property.name,
                type: property.property_type.id,
                subtype: property.property_subtype.id,
                notes: property.description,
                bedroom: property.property_detail?.rooms?.bedroom,
                bathroom: property.property_detail?.rooms?.bathroom,
                parking: property.property_detail?.rooms?.parking,
                features: property.property_detail?.features ?? [],
                restriction: property.property_detail?.restrictions ?? [],
                rent: property.property_detail?.rent_amount,
                lease_term: property.property_detail?.lease_term,
                utilities: [{
                    ...utilityList.reduce((obj, curr) => (obj[curr] = '', obj), {} as any),
                    ...property.property_utility_lists.reduce((obj, e) => (obj[utilityList[parseInt(e.utility_list.id) - 1]] = e.role.id, obj), {} as any)
                }]
            }
            defaultValueInjector(schema as SchemaType, defaultValue).then(s => {
                dynamicSchemaGenerator({
                    schema: s,
                    dataLoader: {
                        type: property_types.property_type.map((e: any) => { return { [e.id]: e.name } }),
                        subtype: property_types.property_subtype.map((e: any) => { return { [e.id]: e.name } }),
                        features: property_attributes?.property_features_list.map((e: any) => e.name),
                        restriction: property_attributes?.property_restrictions_list.map((e: any) => e.name),
                        lease_term: property_attributes?.lease_term_list,
                    },
                    dataMap: (data) => {
                        return {
                            images: (item: any) => {
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
                            utilities: {
                                ...property.property_utility_lists.reduce((obj, curr) =>
                                    (obj[utilityList[parseInt(curr.utility_list.id) - 1]] = (item: any) => (item.isOptional.default = true), obj), {} as any)
                            },
                            subtype: (item: any) => {
                                item.props.values = {
                                    "": "", ...data.subtype.reduce((obj: any, curr: any) => {
                                        obj = { ...obj, ...curr }
                                        return obj;
                                    }, {})
                                };
                            },
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
    const onSubmit = (d: TFormData) => {
        // image updation
        const imagesToDelete = cloneDeep(property?.property_images?.map(e => e?.key));
        const imagesToOmit = [];
        const imgKeys = d.images.map((e: any) => e.file.name);
        for (let i = 0, deleted = 0; i < imgKeys.length; i++) {
            let pos = property?.property_images?.findIndex(e => e?.key === imgKeys[i]);
            if (pos !== -1 && pos !== undefined) {
                imagesToDelete?.splice(pos - deleted, 1);
                deleted++;
                imagesToOmit.push(i);
            }
        }
        while (imagesToOmit.length) {
            d.images.splice(imagesToOmit.pop(), 1);
        }
        cropToAspectRatio(d.images, 16 / 9).then(async t => {
            try {
                let keys = await handleImage(d.images);
                const imageVariable = keys.map((x: string) => {
                    return {
                        key: x,
                        property_id: property?.id
                    }
                });

                addImages({
                    variables: {
                        object: imageVariable
                    }
                })

            } catch (e) {
                console.log(e);
            }
        }).catch(e => {
            console.log(e)
        })
        deleteImages({
            variables: {
                keys: imagesToDelete
            }
        })


        let propertyUpdateData = {
            ...d.address ? {
                coordinates: {
                    "type": "Point",
                    "coordinates": d.address.coords
                }
            } : {},
            description: d.notes,
            type: d.type,
            sub_type: d.subtype
        }
        let details = {
            features: d.features,
            max_occupants: d.tenant_count,
            rent_amount: d.rent,
            restrictions: d.restriction,
            lease_term: d.lease_term,
            rooms: { bedroom: d.bedroom, bathroom: d.bathroom, parking: d.parking },
        }
        updateProperty({
            variables: {
                id: property?.id,
                property: propertyUpdateData,//objectFilter(property, (k, v) => v !== undefined),
                details: details,
                address: d.address?.addressComponents,
                address_id: property?.property_address?.address?.id,
                utilities: Object.values(d.utilities[0]).filter(e => !!e).map((e: any) => ({ ...e, property_id: property?.id }))
            }
        })
    }
    return <Layout>
        {Loader}
        {_schema &&
            <FormGenerator schema={_schema} onSubmit={onSubmit} />
        }
    </Layout>
}