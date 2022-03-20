import React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { usePlaceSuggestions } from '../functions/hooks/usePlaceSuggestions';
import Searchbar from '../components/Searchbar';
import { toast } from 'react-toastify';
import { setGlobalLoader } from '../components/Loader';
import { addressToGeo, extractAddressComponents } from '../functions/api/location';
import { objectFilter } from '../functions/utils';

export default function (): JSX.Element {
    const { suggestions, suggest } = usePlaceSuggestions();
    const navigate = useNavigate();
    const searchProperty = (placeId: string, place: string) => {
        setGlobalLoader(true);
        addressToGeo(placeId).then(d => {
            setGlobalLoader(false)
            const addressComponents = ["administrative_area_level_1", "administrative_area_level_2", "country", "locality", "sublocality", "route", "street_number", "postal_code"] as const;
            let addressComponentValues = extractAddressComponents(d)
            console.log(d.address_components);
            navigate({
                pathname: "/properties",
                search: `?${createSearchParams(objectFilter({
                    c: addressComponentValues.country,
                    loc: addressComponentValues.locality,
                    subloc: addressComponentValues.sublocality,
                    postal: addressComponentValues.postal_code,
                    route: addressComponentValues.route,
                    sn: addressComponentValues.street_number,
                    a1: addressComponentValues.administrative_area_level_1,
                    a2: addressComponentValues.administrative_area_level_2,
                    place: place
                }, (k, v) => !!v))}`
            })
        }).catch(() => {
            setGlobalLoader(false)
            toast.error("There was an error.");
        })
    }
    return (
        <Searchbar suggestionItems={suggestions.map(e => e[0])}
            placeholder="Search Property, Neighbourhood or Address"
            onChange={suggest}
            onSubmit={(v, i) => searchProperty(suggestions[i!][1], v)}
            submitOnSuggestionClick />
    );
}
