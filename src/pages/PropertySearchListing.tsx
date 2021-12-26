import React from 'react';
import PropertyCardDetailed from '../components/PropertyCardDetailed';
import FilterModel from '../components/FilterModal';
import style from './PropertySearchListing.module.scss';
import Layout from './Layout';
import RadioButton from '../components/Form/components/Radiobutton';
import { useClickOutsideEvent } from '../functions/hooks/useClickOutsideEvent';

export default function (): JSX.Element {
    const [filterOpen, setFilterOpen] = React.useState(false);
    const [sortOpen, setSortOpen] = React.useState(false);
    const sortRef = React.useRef<HTMLDivElement>(null!);
    const sortButtonRef = React.useRef<HTMLButtonElement>(null!);
    useClickOutsideEvent<HTMLButtonElement>(sortRef, () => setSortOpen(false), [sortButtonRef]);
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
                    <button ref={sortButtonRef} onClick={() => { setSortOpen(!sortOpen) }}>
                        <i className="fas fa-sort"></i>

                    </button>
                </div>
                    <div ref={sortRef} className={style["sort-popup"]} style={{ display: !sortOpen ? "none" : "revert" }}>
                        <RadioButton name="sort" values={["Default", "Recent"]} />
                    </div>
                <div className={style["filter-wrapper"]} style={{ display: !filterOpen ? "none" : "revert" }}>

                    <div className={style["filter-container"]}>
                        <FilterModel onClose={() => {
                            setFilterOpen(false);
                        }} />

                    </div>
                </div>


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
