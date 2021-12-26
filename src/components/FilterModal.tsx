import React from 'react';
import style from './FilterModal.module.scss';
import filterTop from '../assets/icons/filterTop.svg';
import { PillList } from './PillList';
import pillStyle from './PillList.module.scss';
import { NumberInput } from './NumberInput';
import { useClickOutsideEvent } from '../functions/hooks/useClickOutsideEvent';
import Range from './Form/components/Range';

type props = {
    onClose: () => void;
}
function FilterModel({ onClose = () => { } }: props): JSX.Element {
    const filterRef = React.useRef<HTMLDivElement>(null!);
    useClickOutsideEvent(filterRef, onClose);
    return (
        <div ref={filterRef} className={style["modal-container"]}>
            <div className={style["modal-header"]}>
                <button onClick={onClose} className={style["modal-close-btn"]}>
                    <i className="fas fa-times" />
                </button>
                <div className={style["filter-title"]}>
                    Filters
                </div>
                <div className={style["filter-heading-top"]}>
                    <img src={filterTop} />
                </div>
                <div className={style["filter-heading-icon"]}><i className="fas fa-sliders-h"></i></div>

            </div>
            <div className={style["filter-item-list"]}>
                <div className={style["filter-item"]}>
                    <div className={style["filter-item-heading"]}>
                        Property type
                    </div>
                    <div className={style["filter-item-content"]}>
                        <PillList
                            items={["Condos", "Houses", "Apartments", "Duplex", "Cottage"]}
                        />
                    </div>

                </div>
                <div className={style["filter-item"]}>

                    <div className={style["filter-item-heading"]}>
                        Bathroom(s)
                    </div>
                    <div className={style["filter-item-content"]}>
                        <NumberInput />
                    </div>
                </div>


                <div className={style["filter-item"]}>

                    <div className={style["filter-item-heading"]}>
                        Parking spot(s)
                    </div>
                    <div className={style["filter-item-content"]}>
                        <NumberInput />
                    </div>
                </div>
                <div className={style["filter-item"]}>
                    <div className={style["filter-item-heading"]}>
                        Popular Filters
                    </div>
                    <div className={style["filter-item-content"]}>
                        <PillList
                            items={["Pets", "Heating", "Furniture"]}
                        />
                    </div>

                </div>
                <div className={style["filter-item"]}>
                    <div className={style["filter-item-heading"]}>
                        Features and Amenities
                    </div>
                    <div className={style["filter-item-content"]}>
                        <PillList
                            items={["AC", "Fireplace", "Pool"]}
                        />
                    </div>

                </div>
                <div className={style["filter-item"]}>
                    <div className={style["filter-item-heading"]}>
                        Rent
                    </div>
                    <div className={style["filter-item-content"]}>
                        <Range
                            min={200}
                            max={1200}
                            step={5}
                            defaultValue={[500, 800]}
                            renderThumb={(state => (<div className={`${pillStyle["pill"]} ${pillStyle["pill-active"]}`}>${state.valueNow}</div>))}
                        />
                        <div className={style["range-limit-marker"]}>
                            <div>$200</div>
                            <div>$1200</div>
                        </div>
                    </div>

                </div>
            </div>

        </div >
    );
}

export default FilterModel;