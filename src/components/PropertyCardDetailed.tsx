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
import { IPropertyDetails } from '../queries/property.query';
import defaultImage from '../assets/images/property_placeholder.jpg'
import ClampLines from 'react-clamp-lines';
export default function (props: { propertyData: IPropertyDetails }): JSX.Element {
    const [fav, setFav] = React.useState(false);
    const [currentImage, setCurrentImage] = React.useState(0);
    const images = props.propertyData.property_images?.map(e => e?.s3Url?.url ?? "").slice(0, 5);
    return (
        <div className={style["property-card"]}>
            <div className={style["property-card-container"]}>
                <ImageSlider imgSrc={!images || images.length === 0 ? [defaultImage] : images} aspectRatio={16 / 9} indicatorClassName={style["position-indicator"]} />
                <div className={style["property-details"]}>
                    <div className={style["top-container"]}>
                        <div className={style["property-location"]}>
                            <div>{props.propertyData.type}</div>
                            <ClampLines
                                text={props.propertyData.property_address?.address?.full_address ?? ""}
                                id={Math.random() * 100000 + (props.propertyData.id ?? "")}
                                lines={2}
                                stopPropagation={true}
                                buttons={false}
                            />
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
                                <div>{props.propertyData.property_detail?.rooms?.bedroom} Beds</div>
                            </div>
                            <div>
                                <div className={style["feature-icon"]}>

                                    <img src={bathIcon} />                                </div>

                                <div>{props.propertyData.property_detail?.rooms?.bedroom} Baths</div>
                            </div>
                            {
                                !props.propertyData.property_detail?.restrictions?.includes("pets") &&
                                <div>
                                    <div className={style["feature-icon"]}>
                                        <img src={petIcon} />
                                    </div>

                                    <div>Pets</div>
                                </div>
                            }

                            <div>
                                <div className={style["feature-icon"]}>

                                    <img src={sqftIcon} />                                </div>

                                <div>1250Sqft</div>
                            </div>

                        </div>
                        <div className={style["property-price"]}>
                            <div>C$ {props.propertyData.property_detail?.rent_amount}</div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}