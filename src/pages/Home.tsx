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
function HomePage(): JSX.Element {
    const navigate = useNavigate();
    const { suggestions, suggest } = usePlaceSuggestions();
    const [popularProperties, setPopularProperties] = React.useState<any[]>([]);
    let { data: recentPropertyData, loading: RecentPropertyloading } = useQuery<{ property: IPropertyDetails[] }>(propertyQuery.GET_RECENT_PROPERTIES);
    React.useEffect(() => {
        if (recentPropertyData) {

        }
        console.log(recentPropertyData)
    }, [recentPropertyData])

    // pagination for queries
    // const perPage = 20
    // const [page, setPage] = React.useState(0);
    // const [offset, setOffset] = React.useState(0);
    // 
    // limit: perPage,

    // on loading
    // setPage(page+1)
    // setOffset(page * perPage)
    // send limit and offset vars to queries
    const searchProperty = (placeId: string) => {
        setGlobalLoader(true);
        addressToGeo(placeId).then(d => {
            setGlobalLoader(false)
            navigate({
                pathname: "/properties",
                search: `?${createSearchParams({ lat: d.geometry.location.lat, lng: d.geometry.location.lng })}`
            })
        }).catch(() => {
            setGlobalLoader(false)
            toast.error("There was an error.");
        })
    }

    return (
        <Layout footer={true}>
            <HomeBanner />
            <div style={{ marginTop: 60, marginBottom: 60 }}>
                <Searchbar suggestionItems={suggestions.map(e => e[0])}
                    placeholder="Search Property, Neighbourhood or Address"
                    onChange={suggest}
                    onSubmit={(v, i) => searchProperty(suggestions[i!][1])}
                    submitOnSuggestionClick />
            </div>
            <div style={{ marginTop: 60, marginBottom: 60 }}>
                <MinimalPropertyList title="Popular properties"
                    properties={recentPropertyData?.property ?? []}
                />
                <MinimalPropertyList title="Newly listed properties"
                    properties={[]}
                />
                <button onClick={async () => await suggest("thalassery")} />
            </div>
        </Layout>
    );
}

export default HomePage;
