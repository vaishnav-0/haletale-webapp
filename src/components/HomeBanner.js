import React from 'react';
import "./HomeBanner.scss";
import bannerImg from "../assets/images/BG.jpg"
export default function () {
    return (
        <div class="homebanner-container">
            <div className="overlay">
                <div className="banner-subtext">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium
                </div>
                <div className="banner-maintext">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </div>

            </div>
        </div>
    );
}