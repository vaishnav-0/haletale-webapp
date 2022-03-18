import React from 'react';
import style from './LandlordDashboard.module.scss';
import Layout from '../Layout';
import { ButtonSolid, ButtonSolidWithIndicator } from '../../components/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery, useQuery } from '@apollo/client';
import propertyQuery, { IPropertyDetails } from '../../queries/property.query';
import { useLoder } from '../../components/Loader';
import ClampLines from 'react-clamp-lines';
import requestsQuery, { IRequestData, IRequestCount } from '../../queries/requests.query';
import RequestCard from '../../components/RequestCard';

export default function Example() {
    const navigate = useNavigate();
    const { data: propertyData, loading, fetchMore } = useQuery<{ property_owner: { property: IPropertyDetails }[] }>(propertyQuery.GET_PROPERTY_BY_OWNER, { fetchPolicy: "no-cache" });
    const { data: allRequestCountData, loading: allRequestCountLoading } = useQuery<IRequestCount>(requestsQuery.GET_ALL_REQUEST_COUNT, { fetchPolicy: "no-cache" });
    const allRequestCount = allRequestCountData ? allRequestCountData.property_request_aggregate.aggregate.count : null;
    const [Loader, setLoader] = useLoder({});
    React.useEffect(() => {
        if (loading)
            setLoader(true);
        else
            setLoader(false);
    }, [loading])
    return (
        <Layout>
            {Loader}
            <div className={style["wrapper"]}>
                <div className={style["btn-container"]}>
                    <ButtonSolid onClick={() => navigate("/property/add")}>
                        List Property
                    </ButtonSolid>
                    <ButtonSolidWithIndicator
                        onClick={() => navigate("request/view")}
                        indicator={allRequestCount ? <div className={style["btn-indicator"]}>{allRequestCount}</div> : <></>}>
                        Tenant Request
                    </ButtonSolidWithIndicator>
                </div>
                <div className={style["heading"]}>
                    MY PROPERTIES
                </div>
                <div className={style["properties-list"]}>
                    {
                        propertyData && propertyData?.property_owner.map(_property => {
                            console.log(_property.property)
                            const property = _property.property;
                            const properyRequestCount = allRequestCountData?.property_request.find(e => e.property_id === property.id)?.property.property_requests_aggregate.aggregate.count ?? 0;
                            return (
                                <div className={style["properties-list-card"]}>
                                    <button
                                        className={`${style["properties-list-card-idbtn"]} ${style["btn-link"]}`}
                                        onClick={() => navigate("/property/view?id=" + property.id)} >
                                        {property.id}
                                    </button>
                                    <div >
                                        <div className={style["properties-card-info"]}>
                                            <div>{property.name}</div>
                                            <div>{property.property_type.name}</div>

                                            <ClampLines
                                                text={property.property_address?.address?.full_address ?? ""}
                                                id={Math.random() * 100000 + (property.id ?? "")}
                                                lines={2}
                                                stopPropagation={true}
                                                buttons={false}
                                            />
                                        </div>
                                        {
                                            property.property_detail?.rent_amount &&
                                            <div className={style["properties-card-price"]}>
                                                ${property.property_detail?.rent_amount}
                                            </div>
                                        }

                                    </div>
                                    <div>
                                        <div className={style["properties-card-status"]}>
                                            <span className={style["key"]}>Status: </span>{property.is_approved ? "Approved" : "Pending approval"}
                                        </div>
                                        <ButtonSolidWithIndicator onClick={() => navigate("/property/edit/?id=" + property.id)} className={style["property-card-edit-btn"]} tooltip={property.property_detail ? "" : "Property data incomplete"} indicator={property.property_detail ? <></> : <div className={style["btn-indicator"]}>!</div>}>
                                            Edit
                                        </ButtonSolidWithIndicator>

                                    </div>
                                    {
                                        property.is_approved ?
                                            <div className={style["property-card-metadata"]}>
                                                <div>
                                                    <span className={style["key"]}>Requests: </span>

                                                    {properyRequestCount}
                                                    {!!properyRequestCount &&
                                                        <> (<button
                                                            onClick={() => navigate("request/view?id=" + property.id)}
                                                            className={style["btn-link"]}>view</button>)</>
                                                    }
                                                </div>
                                                {
                                                    //<div>
                                                    //    <span className={style["key"]}>Views: </span>120
                                                    //</div>

                                                    //<div>
                                                    //    <span className={style["key"]}>Viewed: </span>2 minutes ago
                                                    //</div>
                                                    //<div>
                                                    //    <span className={style["key"]}>Other: </span>3
                                                    //</div>
                                                }
                                            </div>
                                            :
                                            <></>
                                    }

                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </Layout >
    );
}

export function ViewRequests() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [getRequests, { data: requests, loading: requestsLoading }] = useLazyQuery<IRequestData>(requestsQuery.GET_REQUEST_BY_ID);
    const [getallRequests, { data: allRequests, loading: allRequestLoading }] = useLazyQuery<IRequestData>(requestsQuery.GET_ALL_REQUESTS);
    React.useEffect(() => {
        if (!searchParams.get("id"))
            getallRequests();
        else {
            getRequests({
                variables: {
                    id: searchParams.get("id")
                }
            })
        }
    }, []);
    const requestsData = searchParams.get("id") ? requests : allRequests;
    console.log(allRequests, requests)
    return <Layout>
        <div className={style["viewrequest-heading"]}>
            {allRequests ?
                "All requests:"
                :
                requests ?
                    <>Requests for
                        <button
                            className={style["btn-link"]}
                            onClick={() => navigate("/property/view?id=" + searchParams.get("id"))} > {searchParams.get("id")}</button>
                    </>
                    :
                    ""
            }
        </div>
        <div className={style["viewrequest-wrapper"]}>

            {
                requestsData?.property_request.map(request => <RequestCard requestData={request} />)
            }
        </div>
    </Layout>
}

