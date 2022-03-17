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

type searchPropertyQueryResult = { search_property: IPropertyDetails[] }
type searchPropertyAggregate = { search_property_aggregate: { aggregate: { totalCount: number } } }
export default function (): JSX.Element {
    let [searchProperties, { data: propertyData, loading, fetchMore }] = useLazyQuery<searchPropertyQueryResult>(propertyQuery.SEARCH_PROPERTY, {
        notifyOnNetworkStatusChange: true
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [filterOpen, setFilterOpen] = React.useState(false);
    const sortButtonRef = React.useRef<HTMLButtonElement>(null!);
    const [openSort, setOpenSort] = React.useState(false);
    const [queryParams, setQueryParams] = React.useState<object | null>(null);
    const [mapOpen, setMapOpen] = React.useState<boolean>(false);
    const [params, setParams] = React.useState<any>({});
    React.useEffect(() => {

        //navigate({ pathname: "/properties", search: "?" + searchParams.toString() });

    }, [searchParams]);
    React.useEffect(() => {
        const coords = (searchParams.get("lat") || searchParams.get("lng")) ? [parseFloat(searchParams.get("lat")!), parseFloat(searchParams.get("lng")!)] : null;
        console.log(searchParams.get("sort-by"))

        let sort = null;
        try {
            sort = JSON.parse(searchParams.get("sort-by")!);
            if (!(sort.created_at === "asc" || sort.created_at === "desc" || sort.property_detail.rent_amount === "asc" || sort.property_detail.rent_amount === "desc"))
                sort = null
        } catch (e) {
            console.log(e);
        }
        console.log(sort);
        const vars = {
            country: searchParams.get("c"),
            locality: searchParams.get("loc"),
            postal_code: searchParams.get("postal"),
            route: searchParams.get("route"),
            street_number: searchParams.get("sn"),
            administrative_area_level_2: searchParams.get("a2"),
            administrative_area_level_1: searchParams.get("a1"),
            ...sort ? { order_by: sort } : {}
        }
        console.log(vars);
        searchProperties({
            variables: vars
        });
        setQueryParams({
            variables: {
                ...vars,
                limit: 4,
                offset: 0
            }
        });
    }, [searchParams])
    return (
        <Layout>
            {
                mapOpen && propertyData &&
                <MapView properties={propertyData.search_property} onClose={() => setMapOpen(false)} />
            }
            <PropertySearchBar />
            <div className={style["header"]}>
                <div className={style["txt-container"]}>
                    <div>{searchParams.get("place")}</div>
                    <div> {propertyData?.search_property?.length ?? 0} properties</div>
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
                            <RadioButtonGroup style={{ width: "100%" }} name="sort"
                                defaultValue={(function () {
                                    try {
                                        const j = JSON.parse(searchParams.get("sort-by")!);
                                        if (j.created_at === "asc")
                                            return "Recent";
                                        else if (j.created_at === "desc")
                                            return "Oldest";
                                        else if (j.property_detail.rent_amount === "asc")
                                            return "Rent asc.";
                                        else if (j.property_detail.rent_amount === "desc")
                                            return "Rent desc."
                                        else
                                            return "Recent"

                                    } catch (e) {
                                        return "Recent";
                                    }
                                }())}
                                values={["Oldest", "Recent", "Rent asc.", "Rent desc."]} onChange={(e) => {
                                    if (e.target.value === "Oldest")
                                        searchParams.set("sort-by", JSON.stringify({ created_at: "desc" }))

                                    else if (e.target.value === "Recent") {
                                        searchParams.set("sort-by", JSON.stringify({ created_at: "asc" }))
                                    }
                                    else if (e.target.value === "Rent asc.") {
                                        searchParams.set("sort-by", JSON.stringify({ property_detail: { rent_amount: "asc" } }))
                                    } else if (e.target.value === "Rent desc.") {
                                        searchParams.set("sort-by", JSON.stringify({ property_detail: { rent_amount: "desc" } }))
                                    }
                                    navigate("?" + searchParams.toString());
                                }
                                } />
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
                <InfiniteList<searchPropertyQueryResult, searchPropertyAggregate>
                    query={propertyQuery.SEARCH_PROPERTY}
                    initialParams={
                        queryParams
                    }
                    aggregateQuery={propertyQuery.SEARCH_PROPERTY_AGGREGATE}
                    wrapperClassName={style["search-list"]}
                    checkSkip={(propertyData,aggregateData) => {
                        return aggregateData?.search_property_aggregate?.aggregate?.totalCount === propertyData?.search_property?.length
                    }}
                >
                    {
                        (propertyData, loading) => <>
                            {
                                propertyData?.search_property?.map(property => <PropertyCardDetailed key={property.id} propertyData={property} />)
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
