import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import userQuery, { IGetUserFav } from '../../queries/user.query';
import { userMutation } from '../../queries';
import style from './useFavourite.module.scss'
import { useAuth } from '../auth/useAuth';
import { toast } from 'react-toastify';

type TUseFavReturn = [boolean | null, () => void, boolean] //fav state, change fav state, updating state]
export default function (propertyId: string): TUseFavReturn {
    const [fav, setFav] = React.useState<boolean | null>(null);
    const { data: favCheck, loading: favCheckLoading, error: favCheckError, refetch: favRecheck } = useQuery<IGetUserFav>(userQuery.CHECK_USER_FAV, {
        variables: {
            property_id: propertyId
        }
    });
    const auth = useAuth();
    const [delFavMutation, { data: delFavData, loading: delFavLoading, error: delFavError }] = useMutation(userMutation.DELETE_FAV);
    const [insertFavMutation, { data: insertFavData, loading: insertFavLoading, error: insertFavError }] = useMutation(userMutation.ADD_USER_FAV);
    React.useEffect(() => {
        if (Array.isArray(favCheck?.user_favourites))
            setFav(!!favCheck!.user_favourites.length);
    }, [favCheck]);
    const changeFavourite = () => {
        if (!auth?.user) {
            toast.warn("Sign in to add this to favourites");
            return
        }
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
    return [fav, changeFavourite, delFavLoading || insertFavLoading];
}

export function FavButton(props: { control: TUseFavReturn }) {
    const [fav, changeFav, favUpdating] = props.control;
    return (
        <button className={style["heart-btn"]}>
            <i onClick={changeFav}
                className={`${fav ? style["heartfilled"] + " fas" : " far"} fa-heart ${favUpdating ? style["heart-loading"] : ""}`}></i>
        </button>
    );
}