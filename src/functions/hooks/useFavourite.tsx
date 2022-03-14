import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import userQuery, { IGetUserFav } from '../../queries/user.query';
import { userMutation } from '../../queries';
export default function (propertyId: string): [boolean | null, () => void, boolean] {
    const [fav, setFav] = React.useState<boolean | null>(null);
    const { data: favCheck, loading: favCheckLoading, error: favCheckError, refetch: favRecheck } = useQuery<IGetUserFav>(userQuery.CHECK_USER_FAV, {
        variables: {
            property_id: propertyId
        }
    });
    const [delFavMutation, { data: delFavData, loading: delFavLoading, error: delFavError }] = useMutation(userMutation.DELETE_FAV);
    const [insertFavMutation, { data: insertFavData, loading: insertFavLoading, error: insertFavError }] = useMutation(userMutation.ADD_USER_FAV);
    React.useEffect(() => {
        if (Array.isArray(favCheck?.user_favourites))
            setFav(!!favCheck!.user_favourites.length);
    }, [favCheck]);
    const changeFavourite = () => {
        if (!delFavLoading || !insertFavLoading)
            if (!fav) {
                insertFavMutation({
                    variables: {
                        property_id: propertyId
                    }
                })
            } else {
                delFavMutation({
                    variables: {
                        property_id: propertyId
                    }
                })
            }
    }
    React.useEffect(() => {
        if (insertFavData || delFavData)
            favRecheck({ property_id: propertyId })
    }, [insertFavData, delFavData]);
    return [fav, changeFavourite, delFavLoading || insertFavLoading]; //3rd item is updating state
}