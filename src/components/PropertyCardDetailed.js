import React from 'react';
import style from "./PropertyCardDetailed.module.scss";
import propertyImg1 from "../assets/images/16_9_house.png";
import propertyImg2 from "../assets/images/housewide.jpg";
import bedIcon from "../assets/icons/pro-details-icon1.png";
import bathIcon from "../assets/icons/pro-details-icon2.png";
import petIcon from "../assets/icons/pro-details-icon3.png";
import sqftIcon from "../assets/icons/pro-details-icon4.png";
import heartIcon from "../assets/icons/heart-thin.svg";
export default function () {
    const [fav, setFav] = React.useState(false);
    return (
        <div className={style["property-card"]}>
            <div className={style["property-card-container"]}>
                <div className={style["image-slider"]}>
                    <div className={style["image-slider-container"]}>
                        <div>
                            <img src={propertyImg1} />

                        </div>
                        <div>
                            <img src={propertyImg2} />

                        </div>
                    </div>

                </div>
                <div className={style["property-details"]}>
                    <div className={style["top-container"]}>
                        <div className={style["property-location"]}>
                            <div>Town House</div>

                            <div>130 Clinton Street - Toronto, ON</div>
                        </div>
                        <div className={style["fav-icon"]}>
                            <i onClick={() => setFav(!fav)} className={`${fav ? style.filled + " fas" : style.regular + " far"} far fa-heart`}></i>
                        </div>
                    </div>
                    <div className={style["bottom-container"]}>
                        <div className={style["property-features"]}>
                            <div>
                                <div className={style["feature-icon"]}>
                                    <img src={bedIcon} />
                                </div>
                                <div>3 Beds</div>
                            </div>
                            <div>
                                <div className={style["feature-icon"]}>

                                    <img src={bathIcon} />                                </div>

                                <div>2 Baths</div>
                            </div>
                            <div>
                                <div className={style["feature-icon"]}>

                                    <img src={petIcon} />                                </div>

                                <div>Pets</div>
                            </div>
                            <div>
                                <div className={style["feature-icon"]}>

                                    <img src={sqftIcon} />                                </div>

                                <div>1250Sqft</div>
                            </div>

                        </div>
                        <div className={style["property-price"]}>
                            <div>C$ 120/Mn</div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}