import React from 'react';
import './Home.scss';
import Layout from './Layout';
import HomeBanner from '../components/HomeBanner';
import MinimalPropertyList from '../components/MinimalPropertyList';
import Searchbar from '../components/Searchbar';


// 

//import { createPresignedUrl } from '../functions/image/src/presignedurl'
// 

import { s3PostUrl } from '../functions/image/index'
function HomePage(): JSX.Element {
    return (
        <Layout footer={true}>
            <HomeBanner />
            <div style={{ marginTop: 60, marginBottom: 60 }}>
                <Searchbar />
            </div>
            <div style={{ marginTop: 60, marginBottom: 60 }}>
                <MinimalPropertyList title="Popular properties" />
                <MinimalPropertyList title="Newly listed properties" />
                <button onClick={() => s3PostUrl({ key: "sfdsfsdf", type: "jpeg" })} />
            </div>
        </Layout>
    );
}

export default HomePage;
