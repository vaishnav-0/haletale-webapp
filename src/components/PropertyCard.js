import React from 'react';
import "./PropertyCard.scss";
import propertyImage from "../assets/images/pro-img1.png"
export default function () {
    return (
        <div className="card-property">
            <img src={propertyImage} />
            <div className="property-price">
                $ 34.000
            </div>
            <div className="property-features">
                <div>3 beds</div>
                <div className="seperator"></div>
                <div>2 baths</div>
            </div>

        </div>
    );
}