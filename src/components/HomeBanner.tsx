import React from 'react';
import style from "./HomeBanner.module.scss";
import bannerImg from "../assets/images/BG.jpg"
export default function (): JSX.Element {
    return (
        <div className={style["homebanner-container"]} >
            <div className={style["overlay"]}>
                {
                    //                    <div className={style["banner-subtext"]}>
                    //                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium
                    //                </div>
                }
                <div className={style["banner-maintext"]}>
                    Renting house for newcomers is just a few
                    <span className={style["clicking-anim"]}>
                        <i className="far fa-hand-point-up"></i>
                    </span>
                    away
                </div>

            </div>
        </ div>
    );
}