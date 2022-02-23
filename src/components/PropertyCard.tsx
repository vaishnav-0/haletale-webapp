import React from 'react';
import style from "./PropertyCard.module.scss";
import propertyImage from "../assets/images/pro-img1.png";
import { IPropertyDetails } from '../queries/property.query';
import ClampLines from 'react-clamp-lines';
import Image from './Image';
export default function ({ property }: { property: IPropertyDetails })
    : JSX.Element {
    return (
        <div className={style["card-property"]}>
            <div className={style["card-img-container"]}>
                <div className={style["AR"]}></div>
                {
                    <Image
                        className={style["card-image"]}
                        src={property.property_images![0] as any}
                    />
                }



            </div>

            <div className={style["property-address"]}>
                <ClampLines
                    text={property.property_address?.address?.full_address ?? ""}
                    id={Math.random() * 100000 + (property.id ?? "")}
                    lines={2}
                    stopPropagation={true}
                    buttons={false}
                />
                <ClampLines
                    text={property.type ?? ""}
                    id={Math.random() * 100000 + (property.id ?? "")}
                    lines={1}
                    stopPropagation={true}
                    buttons={false}
                />
            </div>
            <div className={style["property-features"]}>
                <div>{property.property_detail?.rooms?.bedroom ?? 0} beds</div>
                <div className={style["seperator"]}></div>
                <div> {property.property_detail?.rooms?.bathroom ?? 0} baths</div>
            </div>
            <div className={style["property-price"]}>
                ${property.property_detail?.rent_amount}
            </div>
        </div>
    );
}