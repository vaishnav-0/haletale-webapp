import React from 'react';
import './Home.scss';
import Layout from './Layout';
import HomeBanner from '../components/HomeBanner';
import MinimalPropertyList from '../components/MinimalPropertyList';
import Searchbar from '../components/Searchbar';
import { usePlaceSuggestions } from '../functions/hooks/usePlaceSuggestions';
function HomePage(): JSX.Element {
    const { suggestions, suggest } = usePlaceSuggestions();
    return (
        <Layout footer={true}>
            <HomeBanner />
            <div style={{ marginTop: 60, marginBottom: 60 }}>
                <Searchbar suggestionItems={suggestions.map(e => e[0])}
                    placeholder="Search Property, Neighbourhood or Address"
                    onChange={suggest}
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
