import React from 'react';
import style from './ImageSlider.module.scss';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import PositionIndicator from '../components/PositionIndicator';
interface propType {
    aspectRatio: number;
    indicatorClassName?: string;
    className?: string;
    onClick?: () => void;
    imgSrc: string[];
    showArrows?: boolean;
    showIndicators?: boolean
    showStatus?: boolean;
    infiniteLoop?: boolean;
    onChange?: () => void;
    selectedItem?: number | undefined
}
export default function ({ aspectRatio = 16 / 9, indicatorClassName = "",
    showArrows = false, showIndicators = false, showStatus = false, infiniteLoop = true,
    className = "", onChange = () => { }, onClick = () => { }, selectedItem = 0, imgSrc = [] }: propType) {
    const [currentImage, setCurrentImage] = React.useState(0);
    return (
        <div onClick={onClick} className={style["slider-container"]}>
            <PositionIndicator style={{ position: "absolute", zIndex: "10" }} className={indicatorClassName} onChange={(i) => setCurrentImage(i)}
                position={currentImage} count={2} />
            <Carousel
                className={className}
                showArrows={showArrows}
                showThumbs={false}
                showIndicators={showIndicators}
                showStatus={showStatus}
                emulateTouch={true}
                infiniteLoop={infiniteLoop}
                onChange={(i) => setCurrentImage(i)}
                selectedItem={currentImage}
            >
                {
                    imgSrc.map(i => {
                        return <div className={style["image-slider"]}>

                            <div style={{ paddingBottom: 100 / aspectRatio + "%" }} className={style["aspect-ratio-container"]} />
                            <div className={style["image-slider-container"]}>
                                <img src={i} />
                            </div>
                        </div>
                    })
                }
            </Carousel>
        </div>
    );
}