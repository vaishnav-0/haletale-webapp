import React from "react";
import FormGenerator from "../../components/Form/FormGenerator";
import formStyle from '../../components/Form/Form.module.scss';
import * as yup from 'yup';
import DisplayData from "../../components/Form/DisplayData";
import { SchemaType } from "../../components/Form/FormGenerator";
import { useLoader } from "../../components/Loader";
import metaQuery from "../../queries/meta.query";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { dataMapReturn, dynamicSchemaGenerator, defaultValueInjector } from "../../components/Form/FormGeneratorHelpers";
import userQuery from "../../queries/user.query";
import { useAuth } from "../../functions/auth/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { userMutation } from "../../queries";
import { objectFilter } from "../../functions/utils";
import useStateWithCB from "../../functions/hooks/useStateWithCB";
import { useUserContext } from "../../functions/auth/userContext";
const schema: SchemaType = {
    heading: "",
    submitButton: "Update",
    items: [{
        name: "phone",
        isArray: {
            controlHeading: "",
            title: "Phone no.",
            static: true,
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
                validationSchema: yup.string().matches(/\d+/, "Phone number must only contain numbers").min(10, "Less than 10 digits").typeError("Phone number is required"),
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
    const [Loader, setLoader] = useLoader({});
    const [isComplete, setIscomplete] = React.useState<boolean>(false);
    const [isDisabled, setIsDisabled] = React.useState<boolean>(false);
    const user = useUserContext();
    const navigate = useNavigate();
    const [updateUserBasic, { data: updateUserBasicData, loading: updateUserBasicLoading, error: updateUserBasicError }] = useMutation(userMutation.UPDATE_PHONE_COUNTRY);
    const [queryGetCountries, { data: countryData, loading: countryloading, error }] = useLazyQuery(metaQuery.GET_COUNTRIES);
    const { data: userPhoneNatData, loading: userLoading, error: userQError } = useQuery(userQuery.GET_PHONE_COUNTRY,
        {
            variables: {
                id: user?.user_id
            }
        });
    React.useEffect(() => {
        if (userPhoneNatData) {
            const { phone, user_detail: { nationality } } = userPhoneNatData.user[0];
            console.log(phone, nationality)
            if (phone && nationality)
                setIscomplete(true);
            defaultValueInjector(schema, {
                country: nationality,
                phone: [
                    {
                        phone_number: phone ? phone.split(" ").slice(1).join(" ") : null,
                        country_code: phone ? phone.split(" ")[0] : null
                    }
                ]
            }).then(s => {
                console.log(s);
                _setSchema(s, () => queryGetCountries())
            })
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
            let countries: { [k: string]: string } = { "": "" }, code: any[] = [];
            countryData.countries.forEach((country: any, i: number) => {
                console.log(country.name, country.isoCode, country.dialCode)
                countries[country.id] = country.name;
                code.push({
                    label: country.isoCode + " " + country.dialCode,
                    value: country.dialCode,
                })
            });
            console.log(code)
            if (_schema)
                dynamicSchemaGenerator({
                    schema: _schema,
                    dataLoader: { countries, code },
                    dataMap: (data: { countries: typeof countries, code: typeof code }) => {
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
        const { phone, user_detail: { nationality } } = userPhoneNatData.user[0];
        updateUserBasic({
            variables: {
                phone: phone ?? d.phone[0].country_code.value + " " + d.phone[0].phone_number,
                nationality: nationality ?? d.country,
                id: user?.user_id
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
            navigate("/");
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