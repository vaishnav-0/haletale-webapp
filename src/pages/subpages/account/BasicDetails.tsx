import React from "react";
import FormGenerator from "../../../components/Form/FormGenerator";
import * as yup from 'yup';
import DisplayData from "../../../components/Form/DisplayData";
import { SchemaType } from "../../../components/Form/FormGenerator";
import { useLoder } from "../../../components/Loader";
import metaQuery from "../../../queries/meta.query";
import { useQuery } from "@apollo/client";
import { dataMapReturn, dynamicSchemaGenerator } from "../../../components/Form/FormGeneratorHelpers";
const schema: SchemaType = {
    heading: "Basic details",
    submitButton: "sub",
    items: [{
        name: "phone",
        isArray: {
            controlHeading: "",
            title: "Phone no.",
            single: true,
        },
        items: [
            {
                name: "country_code",
                type: "select",
                props: {
                    values: {}
                },
                defaultValue: ""
            },
            {
                name: "phone_number",
                type: "text",
                props: {
                    type: "text"
                },
                validationSchema: yup.string().matches(/\d+/, "Phone number must only contain numbers").min(10, "Less than 10 digits"),
                defaultValue: ""
            }
        ],

    },
    {
        title: "Country",
        name: "country",
        type: "select",
        props: {
            values: {}
        }
    }
    ]
}
export function BasicDetails() {
    const [_schema, _setSchema] = React.useState<SchemaType | null>(null);
    const [Loader, setLoader] = useLoder({});
    let { data: countryData, loading: countryloading, error } = useQuery(metaQuery.GET_COUNTRIES);
    React.useEffect(() => {
        if (countryData) {
            let countries: any = {}, code: any = {};
            countryData.countries.forEach((country: any) => {
                countries[country.id] = country.name;
                code[country.dialCode] = country.isoCode + " " + country.dialCode;
            })
            console.log(countryData.countries)
            dynamicSchemaGenerator({
                schema: schema,
                dataLoader: { countries, code },
                dataMap: (data) => [
                    {
                        country: (item: any) => {
                            item.props.values = data.countries

                        }
                    }, {
                        phone: [
                            {
                                country_code: (item: any) => item.props.values = data.code
                            }
                        ]
                    }
                ] as dataMapReturn
            }).then(s => {
                console.log("set schema", s);
                _setSchema(s)
            })

        }
    }, [countryData])
    return (
        <>
            {Loader}
            {
                _schema &&

                <FormGenerator
                    schema={_schema}
                    onSubmit={(d) => console.log(d)}
                />
            }
        </>
    )
}