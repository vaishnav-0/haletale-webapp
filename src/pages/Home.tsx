import React from 'react';
import './Home.scss';
import Layout from './Layout';
import HomeBanner from '../components/HomeBanner';
import MinimalPropertyList from '../components/MinimalPropertyList';
import { useQuery } from '@apollo/client';
import propertyQuery from '../queries/property.query';
import { IPropertyDetails } from '../queries/property.query';
import { setGlobalLoader } from '../components/Loader';
import { addressToGeo } from '../functions/api/location';
import { toast } from 'react-toastify';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Roles } from '../functions/auth/types';
import { useUserContext } from '../functions/auth/userContext';
import PropertySearchBar from '../components/PropertySearchBar';
function HomePage(): JSX.Element {
    const navigate = useNavigate();
    const user = useUserContext();
    const { data: recentPropertyData, loading: recentPropertyloading, refetch: refetchRecentProperty } = useQuery<{ property: IPropertyDetails[] }>(propertyQuery.GET_RECENT_PROPERTIES);
    React.useEffect(() => {
        refetchRecentProperty();
    }, [user])
    return (
        <Layout footer={true}>
            <HomeBanner />
            <div style={{ marginTop: 60, marginBottom: 60 }}>
                <PropertySearchBar />
            </div>
            <div style={{ marginTop: 60, marginBottom: 60 }}>
                <MinimalPropertyList title={(user?.role.includes(Roles.landlord) ? "Your r" : "R") + "ecent properties"}
                    properties={recentPropertyData?.property ?? []}
                />
                {
                    //               <MinimalPropertyList title="Newly listed properties"
                    //                 properties={[]}
                    //               />
                }
            </div>
        </Layout>
    );
}

export default HomePage;
