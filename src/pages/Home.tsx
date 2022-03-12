import React from 'react';
import './Home.scss';
import Layout from './Layout';
import HomeBanner from '../components/HomeBanner';
import MinimalPropertyList from '../components/MinimalPropertyList';
import Searchbar from '../components/Searchbar';
import { usePlaceSuggestions } from '../functions/hooks/usePlaceSuggestions';
import { useQuery } from '@apollo/client';
import propertyQuery from '../queries/property.query';
import { s3GetUrl } from '../functions/image';
import { IPropertyDetails } from '../queries/property.query';
import cloneDeep from 'clone-deep';
import { setGlobalLoader } from '../components/Loader';
import { addressToGeo } from '../functions/api/location';
import { toast } from 'react-toastify';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../functions/auth/useAuth';
import { Roles } from '../functions/auth/types';
import { useUserContext } from '../functions/auth/userContext';
function HomePage(): JSX.Element {
    const navigate = useNavigate();
    const user = useUserContext();
    const { suggestions, suggest } = usePlaceSuggestions();
    const { data: recentPropertyData, loading: recentPropertyloading, refetch: refetchRecentProperty } = useQuery<{ property: IPropertyDetails[] }>(propertyQuery.GET_RECENT_PROPERTIES);
    const searchProperty = (placeId: string, place: string) => {
        setGlobalLoader(true);
        addressToGeo(placeId).then(d => {
            console.log(d)
            setGlobalLoader(false)
            navigate({
                pathname: "/properties",
                search: `?${createSearchParams({ lat: d.geometry.location.lat, lng: d.geometry.location.lng, place: place })}`
            })
        }).catch(() => {
            setGlobalLoader(false)
            toast.error("There was an error.");
        })
    }
    React.useEffect(() => {
        console.log("ASDAS")
        refetchRecentProperty();
    }, [user])
    console.log(recentPropertyData, user)
    return (
        <Layout footer={true}>
            <HomeBanner />
            <div style={{ marginTop: 60, marginBottom: 60 }}>
                <Searchbar suggestionItems={suggestions.map(e => e[0])}
                    placeholder="Search Property, Neighbourhood or Address"
                    onChange={suggest}
                    onSubmit={(v, i) => searchProperty(suggestions[i!][1], v)}
                    submitOnSuggestionClick />
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
