import React from 'react';
import style from "./HomeBanner.module.scss";
import clickIcon from "../assets/icons/click.png";
import PropertySearchBar from './PropertySearchBar';
export default function (): JSX.Element {
    return (
        <div className={style["homebanner-container"]} >
            <div className={style["searchbar"]}>
                <PropertySearchBar />
            </div>
            <div className={style["overlay"]}>
                {
                    //                    <div className={style["banner-subtext"]}>
                    //                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium
                    //                </div>
                }
                <div className={style["banner-maintext"]}>
                    Renting house for newcomers is just a few
                    <span className={style["clicking-anim"]}>
                        <img src={clickIcon} />
                    </span>
                    away
                </div>

            </div>
        </ div>
    );
}