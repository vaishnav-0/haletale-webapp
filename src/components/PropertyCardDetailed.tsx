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
import { Link } from 'react-router-dom';
import useFavourite from '../functions/hooks/useFavourite';

export default function (props: { propertyData: IPropertyDetails }): JSX.Element {
    const [fav, updateFav, favUpdating] = useFavourite(props.propertyData.id!)
    const [currentImage, setCurrentImage] = React.useState(0);
    const images = props.propertyData.property_images?.map(e => e?.s3Url?.url ?? "").slice(0, 5);
    return (
        <div className={style["property-card"]}>
            <div className={style["property-card-container"]}>
                <ImageSlider imgSrc={!images || images.length === 0 ? [defaultImage] : images} aspectRatio={16 / 9} indicatorClassName={style["position-indicator"]} />
                <div className={style["property-details"]}>
                    <div className={style["top-container"]}>
                        <div className={style["property-location"]}>
                            <div>{props.propertyData.property_type.name}</div>
                            <div title={props.propertyData.property_address?.address?.full_address}>
                                <ClampLines
                                    text={props.propertyData.property_address?.address?.full_address ?? ""}
                                    id={Math.random() * 100000 + (props.propertyData.id ?? "")}
                                    lines={1}
                                    stopPropagation={true}
                                    buttons={false}
                                />
                            </div>
                        </div>
                        {fav !== null &&
                            <div className={style["fav-icon"]}>
                                <i onClick={updateFav} className={`${fav ? style.filled + " fas" : style.regular + " far"} fa-heart ${favUpdating ? style["heart-loading"] : ""}`}></i>
                            </div>
                        }
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
                            <Link to={"/property/view/?id=" + props.propertyData.id}>View more</Link>
                            <div>C$ {props.propertyData.property_detail?.rent_amount}</div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}