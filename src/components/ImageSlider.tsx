import React from 'react';
import style from './ImageSlider.module.scss';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import PositionIndicator from '../components/PositionIndicator';
import Image from './Image';
import placeholderImg from '../assets/images/property_placeholder.jpg';
interface propType extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    aspectRatio: number;
    indicatorClassName?: string;
    className?: string;
    imgSrc: string[];
    showArrows?: boolean;
    showIndicators?: boolean
    showStatus?: boolean;
    infiniteLoop?: boolean;
    onChange?: () => void;
    selectedItem?: number | undefined
    swipable?: boolean
}
export default function ({ aspectRatio = 16 / 9, indicatorClassName = "",
    showArrows = false, showIndicators = true, showStatus = false, infiniteLoop = true, swipable = true,
    className = "", onChange = () => { }, selectedItem = 0, imgSrc = [], ...rest }: propType) {
    const [currentImage, setCurrentImage] = React.useState(0);
    return (
        <div className={style["slider-container"]} {...rest}>
            {
                showIndicators &&
                <PositionIndicator style={{ position: "absolute", zIndex: "10" }} className={indicatorClassName} onChange={(i) => setCurrentImage(i)}
                    position={currentImage} count={2} />
            }
            <Carousel
                className={className}
                showArrows={showArrows}
                showThumbs={false}
                showIndicators={false}
                showStatus={showStatus}
                swipeable={swipable}
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
                                <Image src={i} default={placeholderImg} style={{ height: "100%", width: "100%", position: "absolute", top: 0 }} />
                            </div>
                        </div>
                    })
                }
            </Carousel>
        </div>
    );
}