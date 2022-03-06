import React from "react";
import FormGenerator from "../../../components/Form/FormGenerator";
import formStyle from '../../../components/Form/Form.module.scss';
import * as yup from 'yup';
import DisplayData from "../../../components/Form/DisplayData";
import { SchemaType } from "../../../components/Form/FormGenerator";
import { useLoder } from "../../../components/Loader";
import metaQuery from "../../../queries/meta.query";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { dataMapReturn, dynamicSchemaGenerator, defaultValueInjector } from "../../../components/Form/FormGeneratorHelpers";
import userQuery from "../../../queries/user.query";
import { useAuth } from "../../../functions/auth/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { userMutation } from "../../../queries";
import { objectFilter } from "../../../functions/utils";
import useStateWithCB from "../../../functions/hooks/useStateWithCB";
const schema: SchemaType = {
    heading: "",
    submitButton: "Update",
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
                defaultValue: "",
                validationSchema: yup.string().required("This field is required")
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
        },
        validationSchema: yup.string().required("This field is required")
    }
    ]
}
export function BasicDetails({ edit }: { edit: boolean }) {
    const [_schema, _setSchema] = useStateWithCB<SchemaType | null>(null);
    const [Loader, setLoader] = useLoder({});
    const [isComplete, setIscomplete] = React.useState<boolean>(false);
    const [isDisabled, setIsDisabled] = React.useState<boolean>(false);
    const auth = useAuth();
    const navigate = useNavigate();
    const [updateUserBasic, { data: updateUserBasicData, loading: updateUserBasicLoading, error: updateUserBasicError }] = useMutation(userMutation.UPDATE_PHONE_COUNTRY);
    const [queryGetCountries, { data: countryData, loading: countryloading, error }] = useLazyQuery(metaQuery.GET_COUNTRIES);
    const { data: userPhoneNatData, loading: userLoading, error: userQError } = useQuery(userQuery.GET_PHONE_COUNTRY,
        {
            variables: {
                id: auth.user?.user_id
            }
        });
    React.useEffect(() => {
        if (userPhoneNatData) {
            const { phone, user_detail: { nationality } } = userPhoneNatData.user[0];
            console.log(phone, nationality)
            console.log(phone.split(" ")[1])
            if (phone && nationality)
                setIscomplete(true);
            if (phone || nationality) {
                queryGetCountries();
                defaultValueInjector(schema, {
                    country: nationality,
                    phone: [
                        {
                            phone_number: phone.split(" ")[1],
                            country_code: phone.split(" ")[0]
                        }
                    ]
                }).then(s => {
                    console.log(s);
                    _setSchema(s)
                })
            }
        }


    }, [userPhoneNatData]);
    React.useEffect(() => {
        if (userPhoneNatData) {
            const { phone, user_detail: { nationality } } = userPhoneNatData.user[0];
            if (edit) {
                if (_schema)
                    dynamicSchemaGenerator({
                        schema: _schema,
                        dataLoader: {},
                        dataMap: (_) => {
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
                        console.log("set schema", s)
                        _setSchema(s)
                    })

                queryGetCountries();
            }
        }
    }, [edit, userPhoneNatData]);
    React.useEffect(() => {
        if (countryData) {
            let countries: any = { "": "" }, code: any = { "": "" };
            countryData.countries.forEach((country: any) => {
                countries[country.id] = country.name;
                code[country.dialCode] = country.isoCode + " " + country.dialCode;
            });
            if (_schema)
                dynamicSchemaGenerator({
                    schema: _schema,
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
                    _setSchema(null, () => _setSchema(s));
                })
        }
    }, [countryData])
    React.useEffect(() => {
        if (countryloading || userLoading)
            setLoader(true)
        else
            setLoader(false)
    }, [countryloading, userLoading]);
    React.useLayoutEffect(() => {
        setLoader(true);
    }, [])
    const onSubmit = (d: any) => {
        console.log(d);
        const { phone, user_detail: { nationality } } = userPhoneNatData.user[0];
        updateUserBasic({
            variables: {
                phone: phone ?? d.phone[0].country_code + " " + d.phone[0].phone_number,
                nationality: nationality ?? d.country,
                id: auth.user?.user_id
            }
        });
    }
    React.useEffect(() => {
        if (updateUserBasicLoading) {
            setIsDisabled(true);
            setLoader(true);
        }
        else
            setLoader(false);
    }, [updateUserBasicLoading])
    React.useEffect(() => {
        if (updateUserBasicData)
            navigate("/account/basics");
    }, [updateUserBasicData])
    console.log(_schema)
    return (
        <>
            {Loader}
            {
                _schema &&
                <>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }} className={formStyle["form-header"]}>Basic details
                        {(!isComplete && !edit) && <Link to="edit" style={{ position: "absolute", fontSize: "0.7em", color: "grey", right: 0 }} > edit</Link>}
                    </div>
                    <FormGenerator
                        schema={_schema}
                        display={!edit}
                        onSubmit={onSubmit}
                        onError={e => console.log(e)}
                        disabled={isDisabled}
                    /></>

            }
        </>
    )
}