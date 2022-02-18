import React from 'react';
import './Home.scss';
import Layout from './Layout';
import HomeBanner from '../components/HomeBanner';
import MinimalPropertyList from '../components/MinimalPropertyList';
import Searchbar from '../components/Searchbar';
import debounce from '../functions/debounce';
import { geocode, addressToGeo, suggest } from '../functions/api/location'

import { x } from '../functions/image/index'

function HomePage(): JSX.Element {
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
    return (
        <Layout footer={true}>
            <HomeBanner />
            <div style={{ marginTop: 60, marginBottom: 60 }}>
                <Searchbar suggestionItems={searchSuggestion.map(e => e[0])}
                    placeholder="Search Property, Neighbourhood or Address"
                    onChange={debouncedSuggest}
                    onSubmit={(v, i) => console.log(v, i)}
                    submitOnSuggestionClick />
            </div>
            <div style={{ marginTop: 60, marginBottom: 60 }}>
                <MinimalPropertyList title="Popular properties" />
                <MinimalPropertyList title="Newly listed properties" />
                <button onClick={async () => await suggest("thalassery")} />
            </div>
        </Layout>
    );
}

export default HomePage;
