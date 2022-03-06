
import React from 'react';
import Layout from './Layout';
import FormGenerator, { FormDataShape, SchemaType } from '../components/Form/FormGenerator';
import * as yup from 'yup';
import { useLoder } from '../components/Loader';
import { dynamicSchemaGenerator, dataMapReturn } from '../components/Form/FormGeneratorHelpers';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import metaQuery from '../queries/meta.query';
import userQuery from '../queries/user.query';
import { useAuth } from '../functions/auth/useAuth';
import { userMutation } from '../queries';
import { useNavigate, useSearchParams } from 'react-router-dom';
import propertyQuery, { IPropertyDetails } from '../queries/property.query';
import requestMutations from '../queries/request.mutation';
import requestsQuery from '../queries/requests.query';
const schema = {
    heading: "Basic details",
    submitButton: "Send request",
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
                    values: {
                    }
                },
                defaultValue: ""
            },
            {
                name: "phone_number",
                type: "text",
                props: {
                    type: "text",
                    placeholder: "Phone no."
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
    },
    {
        title: "Best time to reach out",
        name: "reachout_time",
        type: "select",
        props: {
            values: ["Morning", "Afternoon", "Evening"]
        }
    }, {
        title: "Lease duration in months",
        name: "lease_duration",
        type: "text",
        props: {
            type: "number",
        },
        validationSchema: yup.number().required("This field is required")
    },
    {
        title: "Intended move in date",
        type: "time",
        name: "movein_date",
        props: {
            type: "date"
        },
        validationSchema: yup.string().required("Name is required")
    },
    {
        name: "members",
        items: [
            {
                name: "name",
                title: "Name",
                type: "text",
                props: {
                    type: "text"
                },
                defaultValue: "",
                validationSchema: yup.string().required("Name is required")
            },

        ],
        isArray: {
            controlHeading: "No. of tenants",
            title: (i: any) => `Member ${i}`
        },
        isOptional: {
            title: "Will there be other tenants living with you?",
            default: false,
            sectionHeading: "Members"
        },
    }
    ]
} as const;
type formDataType = FormDataShape<typeof schema>
function SendRequest(): JSX.Element {
    const [updateUserBasic, { data: updateUserBasicData, loading: updateUserBasicLoading, error: updateUserBasicError }] = useMutation(userMutation.UPDATE_PHONE_COUNTRY);
    const [requestMutation, { data: requestMutationData, loading: requestMutationLoading, error: requestMutationError }] = useMutation(requestMutations.SEND_REQUEST);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [getProperty, { data: propertyData, loading: propertyloading, error: propertyQerror }] = useLazyQuery<{ property: IPropertyDetails[] }>(propertyQuery.GET_PROPERTY_BY_ID);
    const [_schema, _setSchema] = React.useState<SchemaType | null>(null);
    const [queryGetCountries, { data: countryData, loading: countryloading, error }] = useLazyQuery(metaQuery.GET_COUNTRIES);
    const auth = useAuth();
    const { data: userPhoneNatData, loading: userLoading, error: userQError } = useQuery(userQuery.GET_PHONE_COUNTRY,
        {
            variables: {
                id: auth.user?.user_id
            }
        });
    const { data: userRequestData, loading: userRequestLoading, error: userRequestError } = useQuery(requestsQuery.GET_REQUEST_BY_ID,
        {
            variables: {
                id: auth.user?.user_id
            }
        });

    const [Loader, setLoader] = useLoder({});
    React.useEffect(() => {
        if (!searchParams.get("property"))
            navigate("/")
        else {
            getProperty({
                variables: {
                    id: searchParams.get("property")
                }
            })
        }
    }, []);
    React.useEffect(() => {
        console.log(userRequestData?.property_request.length && !!userRequestData);
        if (userRequestData?.property_request.length && !!userRequestData)
            navigate("/");
    }, [userRequestData])
    React.useEffect(() => {
        if (!propertyData?.property.length && !!propertyData)
            navigate("/");
    }, [propertyData])
    React.useEffect(() => {
        if (userPhoneNatData) {
            const { phone, user_detail: { nationality } } = userPhoneNatData.user[0];
            dynamicSchemaGenerator({
                schema: schema as SchemaType,
                dataLoader: {},
                dataMap: (data) => {
                    return {
                        country: (item: any) => {
                            if (nationality)
                                item.hidden = true
                        },
                        phone: (item: any) => {
                            if (phone)
                                item.hidden = true;
                        }
                    }
                }
            }).then(s => {
                console.log("set schema", s);
                _setSchema(s)
            })
            if (!phone || !nationality)
                queryGetCountries();

        }


    }, [userPhoneNatData]);
    console.log(_schema)
    React.useEffect(() => {
        if (schema)
            if (countryData) {
                let countries: any = { "": "" }, code: any = { "": "" };
                countryData.countries.forEach((country: any) => {
                    countries[country.id] = country.name;
                    code[country.dialCode] = country.isoCode + " " + country.dialCode;
                })
                dynamicSchemaGenerator({
                    schema: _schema!,
                    dataLoader: { countries, code },
                    dataMap: (data) => {
                        return {
                            country: (item: any) => {
                                item.props.values = data.countries

                            },
                            phone: {
                                country_code: (item: any) => {
                                    item.props.values = data.code
                                },
                            }

                        }
                    }
                }).then(s => {
                    console.log("set schema", s);
                    _setSchema(s)
                })
            }
    }, [countryData])
    React.useEffect(() => {
        if (countryloading || userLoading || userRequestLoading || updateUserBasicLoading || requestMutationLoading)
            setLoader(true)
        else
            setLoader(false)
    }, [countryloading, userLoading, userRequestLoading, updateUserBasicLoading, requestMutationLoading])
    React.useEffect(() => {
        if (userPhoneNatData) {
            const { phone, user_detail: { nationality } } = userPhoneNatData.user[0];
            if (requestMutationData && ((!phone || !nationality) ? updateUserBasicData : 1)) {
                navigate("/");
            }
        }
    }, [updateUserBasicData, requestMutationData])
    const onSubmit = (d: formDataType) => {
        const { phone, user_detail: { nationality } } = userPhoneNatData.user[0];
        if (!phone || !nationality) {
            const { phone, user_detail: { nationality } } = userPhoneNatData.user[0];
            updateUserBasic({
                variables: {
                    phone: phone ?? d.phone[0].country_code + " " + d.phone[0].phone_number,
                    nationality: nationality ?? d.country,
                    id: auth.user?.user_id
                }
            });

        }
        requestMutation({
            variables: {
                intended_move_in_date: d.movein_date,
                lease_duration: d.lease_duration,
                other_tenants: d.members,
                reachout_time: d.reachout_time,
                property_id: searchParams.get("property")
            }
        });
    }
    return (
        <Layout>
            {Loader}
            {
                _schema &&

                <FormGenerator
                    schema={_schema}
                    onSubmit={onSubmit}
                />
            }
        </Layout >
    );
}

export default SendRequest;