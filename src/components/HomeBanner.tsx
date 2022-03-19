import React from 'react';
import "./HomeBanner.scss";
import bannerImg from "../assets/images/BG.jpg"
export default function (): JSX.Element {
    return (
        <div className="homebanner-container">
            <div className="overlay">
                <div className="banner-subtext">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium
                </div>
                <div className="banner-maintext">
                    Renting house for newcomers is just a few clicks away
                </div>

            </div>
        </div>
    );
}