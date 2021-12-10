import React from 'react';
import PropertyCardDetailed from '../components/PropertyCardDetailed';
import style from './PropertySearchListing.module.scss';
import Layout from './Layout';

export default function () {
    return (
        <Layout>
            <div className={style["header"]}>
                <div className={style["txt-container"]}>
                    <div>Toronto</div>
                    <div> 153 properties</div>
                </div>
                <div className={style["btn-container"]}>
                    <button>F</button>
                    <button>S</button>
                </div>
            </div>
            <div className={style["search-list"]}>
                <PropertyCardDetailed />
                <PropertyCardDetailed />
                <PropertyCardDetailed />
                <PropertyCardDetailed />
                <PropertyCardDetailed />
            </div>
        </Layout >
    );
}