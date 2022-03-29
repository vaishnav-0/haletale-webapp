import React from "react";
import Layout from "../Layout";
import propertySearchListingStyle from '../PropertySearchListing.module.scss';
import userQuery, { IFavoriteAggrData, IFavoriteData } from "../../queries/user.query";
import { InfiniteList } from "../../components/InfiniteList";
import PropertyCardDetailed from "../../components/PropertyCardDetailed";
import Skeleton from "react-loading-skeleton";

export default function () {
    const [queryParams, setQueryParams] = React.useState<object | null>(null);
    React.useEffect(() => {
        setQueryParams({
            variables: {
                offset: 0,
                limit: 4
            }
        });
    }, [])
    return <Layout>
        <div style={{ fontSize: "1.4em", fontWeight: 900, margin: "1em 0.5em" }}>My favourites</div>
        {
            queryParams &&
            <InfiniteList<IFavoriteData, IFavoriteAggrData>
                query={userQuery.GET_USER_FAVS}
                aggregateQuery={userQuery.GET_USER_FAVS_AGGREGATE}
                initialParams={queryParams}
                wrapperClassName={propertySearchListingStyle["search-list"]}
                checkSkip={(favs, favsAggr) => favsAggr?.user_favourites_aggregate.aggregate.count === favs?.user_favourites.length}
            >
                {
                    (favs, loading) => <>
                        {
                            favs?.user_favourites.map(fav => <PropertyCardDetailed propertyData={fav.property} />)
                        }
                        {
                            loading && [1, 2].map(k => <Skeleton key={k} style={{ paddingBottom: "56.25%", width: "100%", borderRadius: "20px" }} />)
                        }
                    </>
                }
            </InfiniteList>
        }
    </Layout>
}