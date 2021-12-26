import React from 'react';
import PropertyCardDetailed from '../components/PropertyCardDetailed';
import FilterModel from '../components/FilterModal';
import style from './PropertySearchListing.module.scss';
import Layout from './Layout';

export default function (): JSX.Element {
    const [filterOpen, setFilterOpen] = React.useState(false);
    return (
        <Layout>
            {filterOpen &&
                <div className={style["filter-background"]} />
            }
            <div className={style["header"]}>
                <div className={style["txt-container"]}>
                    <div>Toronto</div>
                    <div> 153 properties</div>
                </div>
                <div className={style["btn-container"]}>
                    <button onClick={() => { setFilterOpen(true); }}><i className="fas fa-sliders-h"></i></button>
                    <button><i className="fas fa-sort"></i></button>
                </div>
                {filterOpen &&
                    <div className={style["filter-wrapper"]}>

                        <div className={style["filter-container"]}>
                            <FilterModel onClose={() => {
                                setFilterOpen(false);
                            }} />

                        </div>
                    </div>

                }

            </div>
            <div className={style["search-list"]}>
                <PropertyCardDetailed />
                <PropertyCardDetailed />
                <PropertyCardDetailed />
                <PropertyCardDetailed />
                <PropertyCardDetailed />
                <PropertyCardDetailed />
            </div>
        </Layout >
    );
}
