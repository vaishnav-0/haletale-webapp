import React from 'react';
import PropertyCardDetailed from '../components/PropertyCardDetailed';
import FilterModel from '../components/FilterModal';
import style from './PropertySearchListing.module.scss';
import Layout from './Layout';
import { RadioButtonGroup } from '../components/Form/components/RadiobuttonGroup';
import { Openable } from '../components/Openable';
import propertyQuery, { IGetAllPropertyAggr, IGetAllPropertyData, IPropertyAttribute, IPropertyDetails } from '../queries/property.query';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import PropertySearchBar from '../components/PropertySearchBar';
import { ButtonSolid } from '../components/Button';
import MapView from './MapView';
import useInfiniteList, { InfiniteList } from '../components/InfiniteList';

type searchPropertyQueryResult = { search_property: IPropertyDetails[] }
type searchPropertyAggregate = { search_property_aggregate: { aggregate: { totalCount: number } } }
export default function (): JSX.Element {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [filterOpen, setFilterOpen] = React.useState(false);
    const sortButtonRef = React.useRef<HTMLButtonElement>(null!);
    const [openSort, setOpenSort] = React.useState(false);
    const [queryParams, setQueryParams] = React.useState<object | null>(null);
    const [mapOpen, setMapOpen] = React.useState<boolean>(false);
    const [params, setParams] = React.useState<any>(null);
    const sortTypeRef = React.useRef<string>()
    const [SearchList, propertyData, propertyAggData] = useInfiniteList<searchPropertyQueryResult, searchPropertyAggregate>({
        query: propertyQuery.SEARCH_PROPERTY,
        initialParams: queryParams ?? {},
        aggregateQuery: propertyQuery.SEARCH_PROPERTY_AGGREGATE,
        wrapperClassName: style["search-list"],
        checkSkip: (propertyData, aggregateData) => {
            return aggregateData?.search_property_aggregate?.aggregate?.totalCount === propertyData?.search_property?.length
        },
        stop: !!searchParams.get("all")
    });
    const [AllPropertiesList, allPropertiesData, allPropertiesAggData] = useInfiniteList<IGetAllPropertyData, IGetAllPropertyAggr>({
        query: propertyQuery.GET_ALL_PROPERTIES,
        initialParams: queryParams ?? {},
        aggregateQuery: propertyQuery.GET_ALL_PROPERTY_AGGREGATE,
        wrapperClassName: style["search-list"],
        checkSkip: (propertyData, aggregateData) => {
            return aggregateData?.property_aggregate.aggregate.totalCount === propertyData?.property.length
        },
        stop: !searchParams.get("all")
    });
    React.useEffect(() => {
        //navigate({ pathname: "/properties", search: "?" + searchParams.toString() });
    }, [searchParams]);
    React.useEffect(() => {
        //const coords = (searchParams.get("lat") || searchParams.get("lng")) ? [parseFloat(searchParams.get("lat")!), parseFloat(searchParams.get("lng")!)] : null;
        //console.log(searchParams.get("sort-by"))
        let vars: any = {};
        if (searchParams.get("all")) {
        } else {

            vars = {
                country: searchParams.get("c"),
                locality: searchParams.get("loc"),
                postal_code: searchParams.get("postal"),
                route: searchParams.get("route"),
                street_number: searchParams.get("sn"),
                administrative_area_level_2: searchParams.get("a2"),
                administrative_area_level_1: searchParams.get("a1"),
                sublocality: searchParams.get("subloc")
            }
        }
        let sort = null;
        try {
            sort = JSON.parse(searchParams.get("sort-by")!);
            if (sort.created_at === "asc")
                sortTypeRef.current = "Recent";
            else if (sort.created_at === "desc")
                sortTypeRef.current = "Oldest";
            else if (sort.property_detail.rent_amount === "asc")
                sortTypeRef.current = "Rent asc.";
            else if (sort.property_detail.rent_amount === "desc")
                sortTypeRef.current = "Rent desc."
            if (!(sort.created_at === "asc" || sort.created_at === "desc" || sort.property_detail.rent_amount === "asc" || sort.property_detail.rent_amount === "desc"))
                sort = null
        } catch (e) {
        }
        vars = {
            ...vars,
            ...sort ? { order_by: sort } : {}
        }
        setParams(vars);
    }, [searchParams]);
    React.useEffect(() => {
        if (params)
            setQueryParams({
                variables: {
                    ...params,
                    limit: 4,
                    offset: 0
                }
            });
    }, [params])
    console.log(openSort)
    return (
        <Layout>
            {
                mapOpen && (allPropertiesData || propertyData) &&
                <MapView properties={searchParams.get("all") ? (allPropertiesData?.property ?? []) : propertyData?.search_property ?? []} onClose={() => setMapOpen(false)} />
            }
            <PropertySearchBar />
            <div className={style["header"]}>
                <div className={style["txt-container"]}>
                    <div>{searchParams.get("place")}</div>
                    <div> {searchParams.get("all") ? allPropertiesAggData?.property_aggregate.aggregate.totalCount : propertyAggData?.search_property_aggregate.aggregate.totalCount} properties</div>
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
                        <RadioButtonGroup style={{ width: "100%" }} name="sort"
                            defaultValue={sortTypeRef.current}
                            values={["Oldest", "Recent", "Rent asc.", "Rent desc."]}
                            onChange={(e) => {
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
                    </div>
                </Openable>
                <div className={style["filter-background"]} style={{ display: filterOpen ? "" : "none" }}>
                    <Openable
                        className={style["filter-container"]} open={[filterOpen, setFilterOpen]}>
                        <FilterModel onClose={() => {
                            setFilterOpen(false);
                        }}
                            onSubmit={(d) => { console.log(d); setParams({ ...params, ...d }) }}
                        />

                    </Openable>
                </div>



            </div>
            {

                searchParams.get("all") ?
                    <AllPropertiesList>
                        {
                            (propertyData, loading) => <>
                                {
                                    propertyData?.property?.map(property => <PropertyCardDetailed key={property.id} propertyData={property} />)
                                }
                                {
                                    loading && [1, 2].map(k => <Skeleton key={k} style={{ paddingBottom: "56.25%", width: "100%", borderRadius: "20px" }} />)
                                }
                            </>
                        }
                    </AllPropertiesList>
                    :
                    <SearchList>
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
                    </SearchList>

            }
        </Layout >
    );
}
