import React from 'react';
import PropertyCardDetailed from '../components/PropertyCardDetailed';
import FilterModel from '../components/FilterModal';
import style from './PropertySearchListing.module.scss';
import Layout from './Layout';
import { RadioButtonGroup } from '../components/Form/components/RadiobuttonGroup';
import { Openable } from '../components/Openable';
import propertyQuery, { IPropertyDetails } from '../queries/property.query';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InView from 'react-intersection-observer';
import Skeleton from 'react-loading-skeleton';
import PropertySearchBar from '../components/PropertySearchBar';
import InfiniteList from '../components/InfiniteList';
import { ButtonSolid } from '../components/Button';
import MapView from './MapView';

type nearbyPropertyQueryResult = { show_nearby_properties: IPropertyDetails[], show_nearby_properties_aggregate: { aggregate: { totalCount: number } } }
export default function (): JSX.Element {
    let [getPropertyByDistance, { data: propertyData, loading, fetchMore }] = useLazyQuery<{ show_nearby_properties: IPropertyDetails[], show_nearby_properties_aggregate: { aggregate: { totalCount: number } } }>(propertyQuery.GET_PROPERTY_BY_DISTANCE, {
        notifyOnNetworkStatusChange: true
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [filterOpen, setFilterOpen] = React.useState(false);
    const sortButtonRef = React.useRef<HTMLButtonElement>(null!);
    const [openSort, setOpenSort] = React.useState(false);
    const [queryParams, setQueryParams] = React.useState<object | null>(null);
    const [mapOpen, setMapOpen] = React.useState<boolean>(false);
    React.useEffect(() => {

        //navigate({ pathname: "/properties", search: "?" + searchParams.toString() });

    }, [searchParams]);
    React.useEffect(() => {
        const coords = (searchParams.get("lat") || searchParams.get("lng")) ? [parseFloat(searchParams.get("lat")!), parseFloat(searchParams.get("lng")!)] : null;
        const cur_coords = coords ? {
            type: "Point",
            coordinates: coords
        } : null
        getPropertyByDistance({
            variables: {
                cur_coords: cur_coords,
                distance: 10,
            }
        });
        setQueryParams({
            variables: {
                cur_coords: cur_coords,
                distance: 10,
                limit: 4,
                offset: 0
            }
        });
    }, [searchParams])
    return (
        <Layout>
            {
                mapOpen && propertyData &&
                <MapView properties={propertyData.show_nearby_properties} onClose={() => setMapOpen(false)} />
            }
            <PropertySearchBar />
            <div className={style["header"]}>
                <div className={style["txt-container"]}>
                    <div>{searchParams.get("place")}</div>
                    <div> {propertyData?.show_nearby_properties.length ?? 0} properties</div>
                </div>
                <div className={style["btn-container"]}>
                    <ButtonSolid onClick={() => setMapOpen(true)}>
                        <i className='far fa-map' />
                    </ButtonSolid>
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
            {
                queryParams &&
                <InfiniteList<nearbyPropertyQueryResult>
                    query={propertyQuery.GET_PROPERTY_BY_DISTANCE}
                    initialParams={queryParams}
                    wrapperClassName={style["search-list"]}
                    checkSkip={(propertyData) => propertyData?.show_nearby_properties_aggregate.aggregate.totalCount === propertyData?.show_nearby_properties.length}
                >
                    {
                        (propertyData, loading) => <>
                            {
                                propertyData?.show_nearby_properties.map(property => <PropertyCardDetailed key={property.id} propertyData={property} />)
                            }
                            {
                                loading && [1, 2].map(k => <Skeleton key={k} style={{ paddingBottom: "56.25%", width: "100%", borderRadius: "20px" }} />)
                            }
                        </>
                    }
                </InfiniteList>
            }
        </Layout >
    );
}
