import React from 'react';
import PropertyCardDetailed from '../components/PropertyCardDetailed';
import FilterModel from '../components/FilterModal';
import style from './PropertySearchListing.module.scss';
import Layout from './Layout';
import {RadioButtonGroup} from '../components/Form/components/RadiobuttonGroup';
import { Openable } from '../components/Openable';

export default function (): JSX.Element {
    const [filterOpen, setFilterOpen] = React.useState(false);
    const sortButtonRef = React.useRef<HTMLButtonElement>(null!);
    const [openSort, setOpenSort] = React.useState(false);
    return (
        <Layout>
            <div className={style["header"]}>
                <div className={style["txt-container"]}>
                    <div>Toronto</div>
                    <div> 153 properties</div>
                </div>
                <div className={style["btn-container"]}>
                    <button onClick={() => { setFilterOpen(true); }}><i className="fas fa-sliders-h"></i></button>
                    <button ref={sortButtonRef} onClick={() => { setOpenSort(!openSort) }}>
                        <i className="fas fa-sort"></i>

                    </button>
                </div>
                <Openable className={style["sort-popup"]}
                    open={[openSort, setOpenSort]}
                    clickOutsideCloseException={[sortButtonRef]}>
                    <div className={style["sortradio-container"]}>
                        {//<RadioButtonGroup name="sort" values={["Default", "Recent"]} />
                        }
                    </div>
                </Openable>
                <div className={style["filter-background"]} style={{ display: filterOpen ? "" : "none" }}>
                    <Openable
                        className={style["filter-container"]} open={[filterOpen, setFilterOpen]}>
                        <FilterModel onClose={() => {
                            setFilterOpen(false);
                        }} />

                    </Openable>
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
