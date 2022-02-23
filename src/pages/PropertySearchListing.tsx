import React from 'react';
import PropertyCardDetailed from '../components/PropertyCardDetailed';
import FilterModel from '../components/FilterModal';
import style from './PropertySearchListing.module.scss';
import Layout from './Layout';
import { RadioButtonGroup } from '../components/Form/components/RadiobuttonGroup';
import { Openable } from '../components/Openable';
import propertyQuery, { IPropertyDetails } from '../queries/property.query';
import { useLazyQuery } from '@apollo/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
export default function (): JSX.Element {
    let [getPropertyByDistance, { data: propertyData, loading }] = useLazyQuery<{ show_nearby_properties: IPropertyDetails[] }>(propertyQuery.GET_PROPERTY_BY_DISTANCE)
    const [currPropertyData, setCurrPropertyData] = React.useState<IPropertyDetails[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [filterOpen, setFilterOpen] = React.useState(false);
    const sortButtonRef = React.useRef<HTMLButtonElement>(null!);
    const [openSort, setOpenSort] = React.useState(false);
    console.log(propertyData);
    React.useEffect(() => {
        if (searchParams.get("lat") && searchParams.get("lng")) {
            const coords = [parseFloat(searchParams.get("lat")!), parseFloat(searchParams.get("lng")!)];
            getPropertyByDistance({
                variables: {
                    cur_coords: {
                        type: "Point",
                        coordinates: coords
                    },
                    distance: 10
                }
            });

        } else
            navigate("/");

    }, [searchParams]);
    React.useEffect(() => {
        propertyData?.show_nearby_properties && setCurrPropertyData(propertyData?.show_nearby_properties);
    }, [propertyData])
    React.useEffect(() => {
    }, [])
    return (
        <Layout>
            <div className={style["header"]}>
                <div className={style["txt-container"]}>
                    <div>{searchParams.get("place")}</div>
                    <div> {currPropertyData.length} properties</div>
                </div>
                <div className={style["btn-container"]}>
                    <button onClick={() => { setFilterOpen(true); }}><i className="fas fa-sliders-h"></i></button>
                    <button ref={sortButtonRef} onClick={() => { setOpenSort(!openSort) }}>
                        <i className="fas fa-sort"></i>

                    </button>
                </div>
                <Openable className={style["sort-popup"]}
                    open={[openSort, setOpenSort]}
                    clickOutsideCloseException={[sortButtonRef]}
                >
                    <div className={style["sortradio-container"]}>
                        {
                            <RadioButtonGroup name="sort" values={["Default", "Recent"]} />
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
                {
                    currPropertyData.map(property => <PropertyCardDetailed propertyData={property} />)
                }
            </div>
        </Layout >
    );
}
