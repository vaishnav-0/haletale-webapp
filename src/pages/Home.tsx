import React from 'react';
import './Home.scss';
import Layout from './Layout';
import HomeBanner from '../components/HomeBanner';
import MinimalPropertyList from '../components/MinimalPropertyList';
import { useQuery } from '@apollo/client';
import propertyQuery from '../queries/property.query';
import { IPropertyDetails } from '../queries/property.query';
import { Roles } from '../functions/auth/types';
import { useUserContext } from '../functions/auth/userContext';
function HomePage(): JSX.Element {
    const user = useUserContext();
    const { data: recentPropertyData, loading: recentPropertyloading, refetch: refetchRecentProperty } = useQuery<{ property: IPropertyDetails[] }>(propertyQuery.GET_RECENT_PROPERTIES, { fetchPolicy: "no-cache" });
    React.useEffect(() => {
        refetchRecentProperty();
    }, [user]);
    return (
        <Layout footer={true}>
            <HomeBanner />
            <div style={{ marginTop: 20, marginBottom: 60 }}>
                <MinimalPropertyList title={user?.role.includes(Roles.landlord) ? "Your Properties:" : "Recent Properties"}
                    properties={recentPropertyData?.property ?? []}
                />
            </div>
        </Layout>
    );
}

export default HomePage;
