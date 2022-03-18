import React from 'react';
import style from './FilterModal.module.scss';
import filterTop from '../assets/icons/filterTop.svg';
import { PillList } from './Form/components/PillList';
import pillStyle from './Form/components/PillList.module.scss';
import { NumberInput } from './Form/components/NumberInput';
import { Range } from './Form/components/Range';
import { useQuery } from '@apollo/client';
import propertyQuery, { IPropertyAttribute } from '../queries/property.query';
import { useLoder } from './Loader';
import { ButtonSolid } from './Button';
import { objectFilter } from '../functions/utils';

type props = {
    onClose: () => void;
    onSubmit: (d: {
        rooms?: { bathroom?: number, bedroom?: number, parking?: number },
        rent_gt?: number | null,
        rent_lt?: number | null,
        features?: string[],
        types?: string[],
        typeFilter?: boolean
    }) => void
}
function FilterModel({ onClose = () => { }, onSubmit }: props): JSX.Element {
    const { data: property_attributes, loading: propertyAttributesLoading } = useQuery<IPropertyAttribute>(propertyQuery.PROPERTY_ATTRIBUTES);
    const { data: property_types, loading } = useQuery(propertyQuery.GET_ALL_PROPERTY_TYPE_SUBTYPE);
    const [Loader, setLoader] = useLoder({});
    const [types, setTypes] = React.useState<string[]>([]);
    const [features, setFeatures] = React.useState<string[]>([]);
    const [rent, setRent] = React.useState<[number | null, number | null]>([null, null]);
    const [rooms, setRooms] = React.useState<object>({})
    return (
        <div className={style["modal-container"]}>
            <div className={style["modal-header"]}>
                <button onClick={onClose} className={style["modal-close-btn"]}>
                    <i className="fas fa-times" />
                </button>
                <div className={style["filter-title"]}>
                    Filters
                </div>
                <div className={style["filter-heading-top"]}>
                    <img alt="" src={filterTop} />
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
                            onChange={(v) => setTypes(v)}
                            items={property_types?.property_type.map((e: any) => e.name) ?? []}
                        />
                    </div>

                </div>
                <div className={style["filter-item"]}>

                    <div className={style["filter-item-heading"]}>
                        Bedroom(s)
                    </div>
                    <div className={style["filter-item-content"]}>
                        <NumberInput min={-1} init={-1} minLabel="any" onChange={(v) => setRooms({ ...rooms, bedroom: v })} />
                    </div>
                </div>



                <div className={style["filter-item"]}>

                    <div className={style["filter-item-heading"]}>
                        Bathroom(s)
                    </div>
                    <div className={style["filter-item-content"]}>
                        <NumberInput min={-1} init={-1} minLabel="any" onChange={(v) => setRooms({ ...rooms, bathroom: v })} />
                    </div>
                </div>


                <div className={style["filter-item"]}>

                    <div className={style["filter-item-heading"]}>
                        Parking spot(s)
                    </div>
                    <div className={style["filter-item-content"]}>
                        <NumberInput min={-1} init={-1} minLabel="any" onChange={(v) => setRooms({ ...rooms, parking: v })} />
                    </div>
                </div>

                <div className={style["filter-item"]}>
                    <div className={style["filter-item-heading"]}>
                        Features and Amenities
                    </div>
                    <div className={style["filter-item-content"]}>
                        <PillList
                            onChange={(v) => setFeatures(v)}
                            items={property_attributes?.property_features_list.map(e => e.name) ?? []}
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
                            max={10000}
                            step={5}
                            defaultValue={[500, 3000]}
                            renderThumb={(state => (<div className={`${pillStyle["pill"]} ${pillStyle["pill-active"]}`}>${state.valueNow}</div>))}
                            onChange={(v) => setRent(v as [number, number])}
                        />
                        <div className={style["range-limit-marker"]}>
                            <div>$200</div>
                            <div>$10000</div>
                        </div>
                    </div>

                </div>
                <ButtonSolid className={style["filter-btn"]}
                    onClick={() => {
                        onSubmit({
                            rooms: objectFilter(rooms, ((k, v) => v !== -1)),
                            features: features,
                            types: types,
                            ...rent[0] === null ? {} : { rent_gt: rent[0] },
                            ...rent[1] === null ? {} : { rent_lt: rent[1] },
                            ...types.length === 0 ? {} : { typeFilter: true }
                        })
                        onClose();
                    }
                    }>Filter</ButtonSolid>
            </div>
        </div >
    );
}

export default FilterModel;

