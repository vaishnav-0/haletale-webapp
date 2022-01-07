import React from 'react';
import '../styles/AccordionStyle.scss'
import ImageSlider from '../components/ImageSlider';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import style from './PropertyDetailed.module.scss';
import Layout from './Layout';
import { ButtonSolid } from '../components/Button';
import forwardIcon from '../assets/icons/forward-icon.svg';
import propertyImg1 from "../assets/images/property.jpeg";
import propertyImg2 from "../assets/images/housewide.jpg";
import bedIcon from '../assets/icons/bed.svg';
import bathIcon from '../assets/icons/bath.svg';
import ImageGallery from '../components/ImageGallery';

export default function Example() {
    const [fav, setFav] = React.useState(false);
    const [notify, setNotify] = React.useState(false);
    const [priceBreakdownOpen, setPriceBreakdownOpen] = React.useState(false);
    const [imageGalleryOpen, setImageGalleryOpen] = React.useState(false);
    const breakdownQuestionRef = React.useRef<HTMLElement>(null!);
    React.useEffect(() => {
        const BQRef_ = breakdownQuestionRef.current;
        const mouseEnterHandler = () => {
            setPriceBreakdownOpen(true);
        }
        const mouseLeaveHandler = () => {
            setPriceBreakdownOpen(false);
        }
        BQRef_.addEventListener('mouseenter', mouseEnterHandler);
        BQRef_.addEventListener('mouseleave', mouseLeaveHandler);
        return () => {
            BQRef_.removeEventListener('mouseenter', mouseEnterHandler);
            BQRef_.removeEventListener('mouseLeave', mouseLeaveHandler)
        }
    }, [])
    return (
        <Layout>
            <div className={style["wrapper"]}>
                {(imageGalleryOpen !== false) &&
                    <div className={style["image-gallery-container"]}>
                        <button type="button" onClick={() => setImageGalleryOpen(false)} className={style["imagegallary-close-btn"]}>
                            <i className="fas fa-times" />
                        </button>
                        <ImageGallery showThumbs={true} showArrows={true} imgSrc={[propertyImg1, propertyImg2]} />
                    </div>
                }
                <div className={style["property-card"]}>
                    <div className={style["top-info"]}>
                        <ButtonSolid className={style["property-map"]}>
                            <i className='far fa-map' />
                        </ButtonSolid>
                        <button className={style["property-id"]}>
                            Property ID: 1204412322
                        </button>
                    </div>
                    <ImageSlider imgSrc={[propertyImg1, propertyImg2]} onClick={() => setImageGalleryOpen(true)} aspectRatio={16 / 9} className={style["image-slider"]} indicatorClassName={style["slider-indicator"]} />
                    <div className={style["property-feature"]}>
                        <div className={style["property-feature-row1"]}>
                            <div>
                                <img src={bedIcon} alt='' />
                                3 BED
                            </div>
                            <div className={style["seperator"]}></div>
                            <div>
                                <img src={bathIcon} alt='' />
                                2 BATH
                            </div>
                            <div className={style["seperator"]}></div>
                            <div>1250 SQ.</div>
                        </div>
                        <div className={style["property-feature-row2"]}>
                            <div>DIRECTION</div>
                            <div>|</div>
                            <div>STREET VIEW</div>
                        </div>
                    </div>

                </div>
                <div className={style["rateinfo"]}>
                    <div className={style["rateinfo-text"]}>
                        <div>
                            Monthly rent share
                        </div>
                        <i ref={breakdownQuestionRef} className='fas fa-question' />
                        <div style={{ display: priceBreakdownOpen ? "" : "none" }} className={style["ratebreakdown"]}>
                            <div className={style["ratebreakdown-item"]}>
                                <div>Utilities included</div>
                                <ul>
                                    <li>Electricity,Water, Maintenence</li>
                                </ul>
                            </div>
                            <div className={style["ratebreakdown-item"]}>
                                <div>C$325: Booking amount</div>
                                <ul>
                                    <li>Rent deposit(first &amp; last)</li>
                                    <li>Key deposit</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={style["rateinfo-rate"]} >C$ 150</div>
                </div>
                <Accordion allowMultipleExpanded allowZeroExpanded>
                    <AccordionItem>
                        <AccordionItemHeading>
                            <AccordionItemButton>
                                About the property
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <ul className={style["feature-accordion-list"]}>
                                <li>Suite Features</li>
                                <li>Building Amenities</li>
                                <li>Bedroom x 1</li>
                                <li>Living Room x 1</li>
                                <li>Common Bathroom</li>
                            </ul>
                        </AccordionItemPanel>
                    </AccordionItem>
                </Accordion>
                <div className={style["bottom-panel"]}>
                    <ButtonSolid className={style["bottom-panel-sendbtn"]} >Send request</ButtonSolid>
                    <button className={style["bottom-panel-icon"]}>
                        <i onClick={() => setFav(!fav)} className={`${fav ? style["heartfilled"] + " fas" : " far"} fa-heart`}></i>
                    </button>
                    <button className={style["bottom-panel-icon"]}>
                        <i onClick={() => setNotify(!notify)} className={`${notify ? style["notifyfilled"] + " fas" : " far"} fa-bell`}></i>
                    </button>
                    <button className={style["bottom-panel-shareicon"]}>
                        <img src={forwardIcon} alt="" />
                    </button>
                </div>
            </div>
        </Layout>
    );
}