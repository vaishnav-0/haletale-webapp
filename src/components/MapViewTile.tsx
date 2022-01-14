import React from "react"
import style from './MapViewTile.module.scss';
import ImageSlider from "../components/ImageSlider";
import propertyImg1 from "../assets/images/property.jpeg";
import propertyImg2 from "../assets/images/housewide.jpg";
import bathIcon from '../assets/icons/bath_white.svg';
import bedIcon from '../assets/icons/bed_white.svg';

const MapViewTile = React.forwardRef<HTMLDivElement, React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) => {
    const [fav, setFav] = React.useState(false);
    return <div ref={ref} className={style["item"]} {...props}>
        <div className={style["item-top-container"]}>
            <div className={style["rate"]}>C$ 120 Month</div>
            <button onClick={(e) => { setFav(!fav); e.stopPropagation() }} className={style["fav-icon"]}>
                <i
                    className={`${fav ? style.filled + " fas" : style.regular + " far"} fa-heart`}
                ></i>
            </button>
            <div className={style["property-feature"]}>
                <div>
                    <img src={bedIcon} alt='' />
                    3 bed
                </div>
                <div className={style["seperator"]}></div>
                <div>
                    <img src={bathIcon} alt='' />
                    2 bath
                </div>
            </div>
        </div>
        <div className={style["property-location"]}>
            <div>Town House</div>

            <div>130 Clinton Street - Toronto, ON</div>
        </div>
        <ImageSlider imgSrc={[propertyImg1, propertyImg2]} aspectRatio={16 / 9} indicatorClassName={style["position-indicator"]}
            showIndicators={false} swipable={false}
        />
    </div>

});
export default MapViewTile;