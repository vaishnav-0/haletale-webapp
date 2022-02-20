import React from 'react';
import Layout from './Layout';
import FormGenerator from '../components/Form/FormGenerator';
import { SchemaType } from '../components/Form/FormGenerator';
import { FormDataShape } from '../components/Form/FormGenerator';
import Searchbar from '../components/Searchbar';
import { PropertyQuery } from '../queries'
import { useQuery } from '@apollo/client';
import propertyQuery from '../queries/property.query';
import Loder, { setLoader } from '../components/Loader';
import { cropToAspectRatio } from '../components/Form/components/Images';
import { dataMapReturn, dynamicSchemaGenerator } from '../components/Form/FormGeneratorHelpers';
import { usePlaceSuggestions } from '../functions/hooks/usePlaceSuggestions';
import { UseFormReturn } from 'react-hook-form';

const schema = {
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
            name: "address_search",
            type: "custom",
            render: function PlaceSuggest(f: UseFormReturn) {
                const { suggestions, suggest } = usePlaceSuggestions();
                return <Searchbar suggestionItems={suggestions.map(e => e[0])}
                    placeholder="Search Property, Neighbourhood or Address"
                    onChange={suggest}
                    onSubmit={(v, i) => {
                        f.setValue("property_address", v); f.setValue("property_coords", "hey")
                    }}
                    submitOnSuggestionClick />
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
    ],
    submitButton: "Next",
} as const;
// const useQueries = () => {
//     let property_types = useQuery(propertyQuery.GET_ALL_PROPERTY_TYPE);
//     let property_subtypes = useQuery(propertyQuery.GET_ALL_PROPERTY_SUBTYPE);
//     return [property_types, property_subtypes];
// }
type FormData = FormDataShape<typeof schema>;
const onSubmit = (d: FormData) => {

}
function AddProperty(): JSX.Element {
    const [schema_, setSchema_] = React.useState<SchemaType | null>(schema as SchemaType);
    // const [
    //     { loading: loading1, data: property_types },
    //     { loading: loading2, data: property_subtypes }
    // ] = useQueries()
    let { data: property_types, loading } = useQuery(propertyQuery.GET_ALL_PROPERTY_TYPE_SUBTYPE);

    React.useEffect(() => {
        if (!loading) {
            dynamicSchemaGenerator({
                schema: schema as SchemaType,
                dataLoader: () => new Promise(res => res(
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

    if (loading) {
        setLoader(true);
        return <></>
    }



    else {
        setLoader(false)
        return (
            <Layout>
                {
                    schema_ &&
                    <FormGenerator schema={schema_ as SchemaType} onError={(e) => console.log(e)}
                        onSubmit={onSubmit} />
                }
            </Layout >
        );
    }
}

export default AddProperty;




