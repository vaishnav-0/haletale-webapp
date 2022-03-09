import React from 'react';
import style from './LandlordDashboard.module.scss';
import Layout from './Layout';
import { ButtonSolid, ButtonSolidWithIndicator } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import propertyQuery, { IPropertyDetails } from '../queries/property.query';
import { useLoder } from '../components/Loader';
import ClampLines from 'react-clamp-lines';

export default function Example() {
    const navigate = useNavigate();
    const { data: propertyData, loading, fetchMore } = useQuery<{ property_owner: { property: IPropertyDetails }[] }>(propertyQuery.GET_PROPERTY_BY_OWNER);
    const [Loader, setLoader] = useLoder({});
    React.useEffect(() => {
        if (loading)
            setLoader(true);
        else
            setLoader(false);
    }, [loading])
    console.log(propertyData);
    return (
        <Layout>
            {Loader}
            <div className={style["wrapper"]}>
                <div className={style["heading"]}>
                    MY PROPERTIES
                </div>
                <div className={style["properties-list"]}>
                    {
                        propertyData && propertyData?.property_owner.map(_property => {
                            const property = _property.property;
                            return (
                                <div className={style["properties-list-card"]}>
                                    <div >
                                        <div className={style["properties-card-info"]}>
                                            <div>{property.name}</div>
                                            <div>{property.type}</div>
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
                                                    <span className={style["key"]}>Requests: </span>x
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