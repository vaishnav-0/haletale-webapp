import React from 'react';
import PropertyCardDetailed from '../components/PropertyCardDetailed';
import FilterModel from '../components/FilterModal';
import style from './PropertySearchListing.module.scss';
import Layout from './Layout';
import RadioButton from '../components/Form/components/Radiobutton';
import { useClickOutsideEvent } from '../functions/hooks/useClickOutsideEvent';
import { useOpenable, Openable } from '../functions/hooks/useOpenable';

export default function (): JSX.Element {
    const [filterOpen, setFilterOpen] = React.useState(false);
    const sortButtonRef = React.useRef<HTMLButtonElement>(null!);
    const sortMenu = useOpenable({ clickOutsideCloseException: [sortButtonRef] })

    React.useEffect(() => {
        //sortMenu.setClickOutsideExceptions([sortButtonRef.current])
    }, []);
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
                    <button ref={sortButtonRef} onClick={() => { sortMenu.setOpen(!sortMenu.isOpen) }}>
                        <i className="fas fa-sort"></i>

                    </button>
                </div>
                <Openable className={style["sort-popup"]} {...sortMenu.props}>
                    <RadioButton name="sort" values={["Default", "Recent"]} />
                </Openable>
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
