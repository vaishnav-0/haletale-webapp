import React from 'react';
import style from './ImageSlider.module.scss';
import propertyImg1 from "../assets/images/property.jpeg";
import propertyImg2 from "../assets/images/housewide.jpg";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import PositionIndicator from '../components/PositionIndicator';
type propType = {
    aspectRatio: number;
    indicatorClassName?: string;
    className?: string
}
export default function ({ aspectRatio = 16 / 9, indicatorClassName = "", className = "" }: propType) {
    const [currentImage, setCurrentImage] = React.useState(0);
    return (
        <div className={style["slider-container"]}>
            <PositionIndicator style={{ position: "absolute", zIndex: "10" }} className={indicatorClassName} onChange={(i) => setCurrentImage(i)}
                position={currentImage} count={2} />
            <Carousel
                className={className}
                showThumbs={false}
                showArrows={false}
                showIndicators={false}
                showStatus={false}
                emulateTouch={true}
                infiniteLoop={true}
                onChange={(i) => setCurrentImage(i)}
                selectedItem={currentImage}
            >
                <div className={style["image-slider"]}>
                    <div style={{ paddingBottom: 100 / aspectRatio + "%" }} className={style["aspect-ratio-container"]} />
                    <div className={style["image-slider-container"]}>
                        <img src={propertyImg1} />
                    </div>
                </div>
                <div className={style["image-slider"]}>
                    <div className={style["aspect-ratio-container"]} />
                    <div className={style["image-slider-container"]}>
                        <img src={propertyImg2} />
                    </div>
                </div>
            </Carousel>
        </div>
    );
}