
import React from 'react';
import Layout from '../Layout';
import FormGenerator, { FormDataShape, SchemaType } from '../../components/Form/FormGenerator';
import * as yup from 'yup';
import { useLoader } from '../../components/Loader';
import { dynamicSchemaGenerator, dataMapReturn } from '../../components/Form/FormGeneratorHelpers';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import metaQuery from '../../queries/meta.query';
import userQuery from '../../queries/user.query';
import { userMutation } from '../../queries';
import { useNavigate, useSearchParams } from 'react-router-dom';
import propertyQuery, { IPropertyDetails } from '../../queries/property.query';
import requestMutations from '../../queries/request.mutation';
import requestsQuery from '../../queries/requests.query';
import { toast } from 'react-toastify';
import { useUserContext } from '../../functions/auth/userContext';
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
                type: "dropdownSelect",
                props: {
                    placeholder: "Country code",
                },
                defaultValue: "",
                validationSchema: yup.object().typeError("This field is required")
            },
            {
                name: "phone_number",
                type: "text",
                props: {
                    type: "text",
                    placeholder: "Phone no."
                },
                validationSchema: yup.string().matches(/\d+/, "Phone number must only contain numbers").min(10, "Less than 10 digits").typeError("Phone no. is required"),
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
        },
        validationSchema: yup.string().required("This field is required")
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
        validationSchema: yup.number().typeError("This field should be a number").required("This field is required")
    },
    {
        title: "Intended move in date",
        type: "time",
        name: "movein_date",
        props: {
            type: "date",
            max: "9999-12-31"

        },
        validationSchema: yup.date().typeError("Invalid date").max(new Date(2024, 1), "Invalid date").min(new Date(), "Invalid date")
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
            {
                name: "email",
                title: "Email",
                type: "text",
                props: {
                    type: "text"
                },
                defaultValue: "",
                validationSchema: yup.string().email("Should be a valid email.").required("Email is required")
            }

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
    const user = useUserContext();
    const { data: userPhoneNatData, loading: userLoading, error: userQError } = useQuery(userQuery.GET_PHONE_COUNTRY,
        {
            variables: {
                id: user?.user_id
            },
            fetchPolicy: "no-cache"
        });
    const [getSameRequest, { data: userRequestData, loading: userRequestLoading, error: userRequestError }] = useLazyQuery(requestsQuery.GET_REQUEST_BY_ID, { fetchPolicy: "no-cache" });

    const [Loader, setLoader] = useLoader({});
    React.useEffect(() => {
        if (!searchParams.get("id"))
            navigate("/")
        else {
            getSameRequest({
                variables: {
                    id: searchParams.get("id")
                }
            });
            getProperty({
                variables: {
                    id: searchParams.get("id")
                }
            })
        }
    }, []);
    React.useEffect(() => {
        if (userRequestData?.property_request.length && !!userRequestData) {
            toast.warn("Request already sent");
            navigate("/");//to request listing page
        }
    }, [userRequestData])
    React.useEffect(() => {
        if (!propertyData?.property.length && !!propertyData)
            navigate("/");
    }, [propertyData])
    React.useEffect(() => {
        if (userPhoneNatData) {
            const phone = userPhoneNatData.user[0].phone;
            const nationality = userPhoneNatData.user[0]?.user_detail?.nationality
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
                _setSchema(s)
            })
            if (!phone || !nationality)
                queryGetCountries();

        }


    }, [userPhoneNatData]);
    React.useEffect(() => {
        if (schema)
            if (countryData) {
                let countries: { [k: string]: string } = { "": "" }, code: any = [];
                countryData.countries.forEach((country: any) => {
                    countries[country.id] = country.name;
                    code.push({
                        label: country.isoCode + " " + country.dialCode,
                        value: country.dialCode,
                    })
                })
                if (_schema)
                    dynamicSchemaGenerator({
                        schema: _schema,
                        dataLoader: { countries, code },
                        dataMap: (data: { countries: typeof countries, code: any }) => {
                            return {
                                country: (item: any) => {
                                    item.props.values = Object.entries(data.countries).sort(([_, v1], [__, v2]) => v1 > v2 ? 1 : v1 < v2 ? -1 : 0).reduce((o, [k, v]) => ({ ...o, [k]: v }), {})
                                },
                                phone: {
                                    country_code: (item: any) => {
                                        item.props = {
                                            ...item.props,
                                            options: data.code,
                                            searchBy: "search"
                                        }
                                    },
                                }

                            }
                        }
                    }).then(s => {
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
            const phone = userPhoneNatData.user[0].phone;
            const nationality = userPhoneNatData.user[0]?.user_detail?.nationality
            if (requestMutationData && ((!phone || !nationality) ? updateUserBasicData : 1)) {
                toast.success("Request sent.");
                navigate("/");
            }
        }
    }, [updateUserBasicData, requestMutationData])
    const onSubmit = (d: formDataType) => {
        const phone = userPhoneNatData.user[0].phone;
        const nationality = userPhoneNatData.user[0]?.user_detail?.nationality
        if (!phone || !nationality) {
            updateUserBasic({
                variables: {
                    phone: phone ?? d.phone[0].country_code.value + " " + d.phone[0].phone_number,
                    nationality: nationality ?? d.country,
                    id: user?.user_id
                }
            });

        }
        requestMutation({
            variables: {
                intended_move_in_date: d.movein_date,
                lease_duration: d.lease_duration,
                other_tenants: d.members,
                reachout_time: d.reachout_time,
                property_id: searchParams.get("id")
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