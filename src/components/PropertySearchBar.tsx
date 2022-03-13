import React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { usePlaceSuggestions } from '../functions/hooks/usePlaceSuggestions';
import Searchbar from '../components/Searchbar';
import { toast } from 'react-toastify';
import { setGlobalLoader } from '../components/Loader';
import { addressToGeo } from '../functions/api/location';

export default function (): JSX.Element {
    const { suggestions, suggest } = usePlaceSuggestions();
    const navigate = useNavigate();
    const searchProperty = (placeId: string, place: string) => {
        setGlobalLoader(true);
        addressToGeo(placeId).then(d => {
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
    return (
            <div style={{ marginTop: 60, marginBottom: 60 }}>
                <Searchbar suggestionItems={suggestions.map(e => e[0])}
                    placeholder="Search Property, Neighbourhood or Address"
                    onChange={suggest}
                    onSubmit={(v, i) => searchProperty(suggestions[i!][1], v)}
                    submitOnSuggestionClick />
            </div> 
    );
}
