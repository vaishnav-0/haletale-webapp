import React from 'react';
import style from "./PropertyCardDetailed.module.scss";
import propertyImg1 from "../assets/images/property.jpeg";
import propertyImg2 from "../assets/images/housewide.jpg";
import bedIcon from "../assets/icons/pro-details-icon1.png";
import bathIcon from "../assets/icons/pro-details-icon2.png";
import petIcon from "../assets/icons/pro-details-icon3.png";
import sqftIcon from "../assets/icons/pro-details-icon4.png";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ImageSlider from './ImageSlider';

export default function (): JSX.Element {
    const [fav, setFav] = React.useState(false);
    const [currentImage, setCurrentImage] = React.useState(0);
    return (
        <div className={style["property-card"]}>
            <div className={style["property-card-container"]}>
                <ImageSlider imgSrc={[propertyImg1, propertyImg2]} aspectRatio={16 / 9} indicatorClassName={style["position-indicator"]} />

                <div className={style["property-details"]}>
                    <div className={style["top-container"]}>
                        <div className={style["property-location"]}>
                            <div>Town House</div>

                            <div>130 Clinton Street - Toronto, ON</div>
                        </div>
                        <div className={style["fav-icon"]}>
                            <i onClick={() => setFav(!fav)} className={`${fav ? style.filled + " fas" : style.regular + " far"} fa-heart`}></i>
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