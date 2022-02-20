import React from 'react';
import Layout from './Layout';
import FormGenerator from '../components/Form/FormGenerator';
import { SchemaType } from '../components/Form/FormGenerator';


import propertyMutation from '../queries/property.mutation'
import { useQuery, useMutation } from '@apollo/client';
import propertyQuery from '../queries/property.query';
import Loder, { setLoader } from '../components/Loader';



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
            title: "Property type",
            name: "subtype",
            type: "select",
            props: {
                values: { "-": "", "snow": "Main level", "lawn": "Basement" }
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
            title: "Lease term",
            name: "lease_term",
            type: "select",
            props: {
                values: { "-": "", "snow": "6 Months to 1 year", "lawn": "1 year" }
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
            props: {}
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
}
const useQueries = () => {


    let property_types = useQuery(propertyQuery.GET_ALL_PROPERTY_TYPE, {
        // onCompleted: (data) => // setProducts(getProductData(d))
    });
    let property_subtypes = useQuery(propertyQuery.GET_ALL_PROPERTY_SUBTYPE, {
        // onCompleted: (data) => // setProducts(getProductData(d))
    });
    return [property_types, property_subtypes];
}


function AddProperty(): JSX.Element {


    const [addProperty, { data, loading, error }] = useMutation(propertyMutation.ADD_PROPERTY)

    if (error) console.log(error)
    if (data) console.log(data)
    if (loading) console.log(loading)

    const [
        { loading: loading1, data: property_types },
        { loading: loading2, data: property_subtypes }
    ] = useQueries()


    if (property_types && property_subtypes)
        console.log(property_subtypes, property_subtypes)

    if (loading1 && loading2) {
        setLoader(true);
        return <></>
    }



    else {
        setLoader(false)
        return (
            <Layout>
                <FormGenerator schema={schema} onError={(e) => console.log(e)}
                    onSubmit={(d) => console.log(d)} />
                {/* 
                    <PillCollection
                        items={{
                            single: [{ name: "cover", limit: 1, value: "cover" }, { name: "abc", value: "abc", limit: 5 }],
                            group: [{ name: "roomtype", items: ["bedroom", "bathroom"], limit: 1 }]
                        }}
                    >
                        {
                            ({ List, Groups }) => {
                                return <>
                                    <div className={style["form-item"]}>
                                        <div className={style["form-item-heading"]}>
                                            list1
                                        </div>
                                        <List />
                                        <Groups.roomtype />
                                    </div>
                                    <div className={style["form-item"]}>
                                        <div className={style["form-item-heading"]}>
                                            list2
                                        </div>
                                        <List />
                                        <Groups.roomtype />

                                    </div>
                                </>
                            }
                        }
                    </Pill
                    Collection>
 */}

                <button onClick={() => addProperty({
                    variables: {

                        coordinates: {
                            "type": "Point",
                            "coordinates": [
                                75.87158203125,
                                11.210733765689508
                            ]
                        },
                        name: "test",
                        description: "test",
                        type: "Condos",
                        sub_type: "Mainlevel"
                    }
                })}></button>
            </Layout >
        );
    }
}

export default AddProperty;