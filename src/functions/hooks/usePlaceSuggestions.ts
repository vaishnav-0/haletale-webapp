import React from "react";
import debounce from '../debounce';
import { suggest } from '../api/location'

export function usePlaceSuggestions() {
    const [searchSuggestion, setSearchSuggestion] = React.useState<string[]>([])
    const suggestPlaces = (search: string) => {
        if (search !== "")
            suggest(search).then(data => {
                setSearchSuggestion(data);
            }).catch(e => console.log(e))
        else
            setSearchSuggestion([]);

    }
    const debouncedSuggest = React.useCallback(debounce(suggestPlaces, 800), []);
    return { suggestions: searchSuggestion, suggest: debouncedSuggest }
}
