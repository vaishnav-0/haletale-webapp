import React from 'react';
import style from './ImageGallery.module.scss';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import PositionIndicator from '../components/PositionIndicator';
import Image from './Image';
import placeholderImg from '../assets/images/property_placeholder.jpg';
interface propType {
    indicatorClassName?: string;
    className?: string;
    onClick?: () => void;
    imgSrc: string[];
    showThumbs?: boolean;
    showArrows?: boolean;
    showIndicators?: boolean
    showStatus?: boolean;
    infiniteLoop?: boolean;
    onChange?: () => void;
    selectedItem?: number | undefined
}
export default function ({ indicatorClassName = "",
    showThumbs = false, showArrows = false, showIndicators = false, showStatus = false, infiniteLoop = true,
    className = "", onChange = () => { }, onClick = () => { }, selectedItem = 0, imgSrc = [] }: propType) {
    const [currentImage, setCurrentImage] = React.useState(0);
    const customRenderThumb = (children:any) =>
        children.map((item:any) => {
            console.log(item)
            return <img src={item.props.children.props.src} />;
        });
    return (
        <div onClick={onClick} className={style["slider-container"]}>
            <PositionIndicator style={{ position: "absolute", zIndex: "10" }} className={indicatorClassName + " " + style["position-indicator"]} onChange={(i) => setCurrentImage(i)}
                position={currentImage} count={imgSrc.length} />
            <Carousel
                className={className}
                showThumbs={showThumbs}
                showArrows={showArrows}
                showIndicators={showIndicators}
                showStatus={showStatus}
                emulateTouch={true}
                infiniteLoop={infiniteLoop}
                onChange={(i) => setCurrentImage(i)}
                selectedItem={currentImage}
                dynamicHeight={true}
                renderThumbs={customRenderThumb}
            >
                {
                    imgSrc.map((src, i) => {
                        return <div key={i} className={style["image-container"]}>
                            <Image src={src} default={placeholderImg} style={{ height: "100%", width: "100%", position: "absolute", top: 0 }} />
                        </div>
                    })
                }
            </Carousel>
        </div>
    );
}