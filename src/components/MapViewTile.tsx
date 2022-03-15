import React from "react"
import style from './MapViewTile.module.scss';
import ImageSlider from "../components/ImageSlider";
import propertyImg1 from "../assets/images/property.jpeg";
import propertyImg2 from "../assets/images/housewide.jpg";
import bathIcon from '../assets/icons/bath_white.svg';
import bedIcon from '../assets/icons/bed_white.svg';
import { Link } from "react-router-dom";
import defaultImage from '../assets/images/property_placeholder.jpg'
import { IPropertyDetails } from "../queries/property.query";
import ClampLines from "react-clamp-lines";
import useFavourite, { FavButton } from "../functions/hooks/useFavourite";
interface PropsType {
    highlight?: boolean,
    property: IPropertyDetails,
    onClick?: () => void
}
const MapViewTile = React.forwardRef<HTMLDivElement, PropsType>((props, ref) => {
    const { property, highlight } = props;
    const favControls = useFavourite(property.id!)
    const images = property.property_images?.map(e => e?.s3Url?.url ?? "").slice(0, 1);
    return <div ref={ref} className={style["item"] + ` ${highlight ? style["highlight"] : ""}`} onClick={props.onClick}>
        <div className={style["item-top-container"]}>
            <div className={style["rate"]}>C$ {property.property_detail?.rent_amount}</div>
            <div className={style["fav-icon-container"]}>
                <FavButton control={favControls} />
            </div>
            <div className={style["property-feature"]}>
                <div>
                    <img src={bedIcon} alt='' />
                    {property.property_detail?.rooms?.bedroom} bed
                </div>
                <div className={style["seperator"]}></div>
                <div>
                    <img src={bathIcon} alt='' />
                    {property.property_detail?.rooms?.bathroom} bath
                </div>
            </div>
        </div>
        <div className={style["item-bottom-container"]}>
            <div className={style["property-location"]}>
                <div>{property.type}</div>
                <ClampLines
                    text={property.property_address?.address?.full_address ?? ""}
                    id={Math.random() * 100000 + (property.id ?? "")}
                    lines={2}
                    stopPropagation={true}
                    buttons={false}
                />
            </div>
            <Link to={"/property/view/?id=" + property.id}><i className="fas fa-arrow-right" /></Link>
        </div>
        <ImageSlider imgSrc={!images || images.length === 0 ? [defaultImage] : images} aspectRatio={16 / 9} indicatorClassName={style["position-indicator"]}
            showIndicators={false} swipable={false}
        />
    </div>

});
export default MapViewTile;