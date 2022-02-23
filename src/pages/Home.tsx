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
    let { data: propertyData, loading } = useQuery<{ property: IPropertyDetails[] }>(propertyQuery.GET_PROPERTY_BY_ID, {
        variables: {
            id: "662fd90d-2021-4b70-a29d-a03544f68724"
        }
    });
    React.useEffect(() => {
        if (propertyData) {
            const imgUrls = Promise.all(propertyData!.property[0]!.property_images!.map(image => s3GetUrl({ key: image!.key }))).then(img => {
                console.log(img);
                const propertyDataCopy = cloneDeep(propertyData);
                propertyDataCopy!.property[0].property_images = img;
                setPopularProperties(propertyDataCopy!.property);
            })
        }
        console.log(propertyData)
    }, [propertyData])

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
                    properties={popularProperties}
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
