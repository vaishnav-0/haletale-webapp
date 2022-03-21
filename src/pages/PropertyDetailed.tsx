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
import { useSearchParams, useNavigate } from 'react-router-dom';
import propertyQuery, { IPropertyDetails } from '../queries/property.query';
import { useLazyQuery } from '@apollo/client';
import { useLoader } from '../components/Loader';
import defaultImage from '../assets/images/property_placeholder.jpg'
import ClampLines from 'react-clamp-lines';
import { useAuth } from '../functions/auth/useAuth';
import { Roles } from '../functions/auth/types';
import useFavourite, { FavButton } from '../functions/hooks/useFavourite';
import { toast } from 'react-toastify';

const imageSliderClickHandler = (cb: () => void) => {
    const delta = 6;
    let startX: number;
    let startY: number;
    let handlers: { mousedown?: React.MouseEventHandler<HTMLDivElement>, mouseup?: React.MouseEventHandler<HTMLDivElement> } = {};
    handlers.mousedown = function (event) {
        startX = event.pageX;
        startY = event.pageY;
    }

    handlers.mouseup = function (event) {
        const diffX = Math.abs(event.pageX - startX);
        const diffY = Math.abs(event.pageY - startY);

        if (diffX < delta && diffY < delta) {
            cb();
        }
    }
    return handlers;
}
export default function Example() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [skipFav, setSkipFav] = React.useState<boolean>(true);
    const favControl = useFavourite(searchParams.get("id")!, skipFav)
    const [Loader, setLoader] = useLoader({});
    const auth = useAuth();
    const [getProperty, { data: propertyData, loading: propertyloading, error }] = useLazyQuery<{ property: IPropertyDetails[] }>(propertyQuery.GET_PROPERTY_BY_ID, { fetchPolicy: "network-only" });
    const navigate = useNavigate();
    const [notify, setNotify] = React.useState(false);
    const [priceBreakdownOpen, setPriceBreakdownOpen] = React.useState(false);
    const [imageGalleryOpen, setImageGalleryOpen] = React.useState(false);
    const breakdownQuestionRef = React.useRef<HTMLElement>(null!);
    const imageSliderClick = React.useMemo(() =>
        imageSliderClickHandler(() => setImageGalleryOpen(true)),
        [setImageGalleryOpen],
    );
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
    React.useEffect(() => {
        if (!searchParams.get("id"))
            navigate("/")
        else {
            getProperty({
                variables: {
                    id: searchParams.get("id")
                }
            })
        }
    }, [searchParams]);
    React.useEffect(() => {
        if (propertyloading)
            setLoader(true);
        else
            setLoader(false);
    }, [propertyloading]);
    React.useEffect(() => {
        if (propertyData?.property.length === 0 || error)
            navigate("/");

    }, [propertyData, error]);
    React.useEffect(() => {
        if (auth?.user?.role.includes(Roles['tenant']))
            setSkipFav(false);
    }, [auth]);
    const property = propertyData?.property[0];
    return (
        <Layout>
            {
                Loader
            }
            <div className={style["wrapper"]}>
                {(imageGalleryOpen !== false) &&
                    <div className={style["image-gallery-container"]}>
                        <button type="button" onClick={() => setImageGalleryOpen(false)} className={style["imagegallary-close-btn"]}>
                            <i className="fas fa-times" />
                        </button>
                        <ImageGallery showThumbs={true} showArrows={true} imgSrc={property?.property_images?.map(e => e?.s3Url?.url ?? "") ?? [defaultImage]} />
                    </div>
                }
                <div className={style["property-card"]}>
                    <div className={style["top-info"]}>
                        <ButtonSolid className={style["property-map"]}>
                            <i className='far fa-map' />
                        </ButtonSolid>
                        <button className={style["property-id"]}>
                            <ClampLines
                                text={`Property ID: ${property?.id}`}
                                id={Math.random() * 100000 + (property?.id ?? "")}
                                lines={1}
                                stopPropagation={true}
                                buttons={false}
                            />
                        </button>
                    </div>
                    <ImageSlider onMouseDown={imageSliderClick.mousedown} onMouseUp={imageSliderClick.mouseup}
                        imgSrc={propertyData?.property[0]?.property_images?.map(e => e?.s3Url?.url ?? "") ?? [defaultImage]}
                        aspectRatio={16 / 9} className={style["image-slider"]} indicatorClassName={style["slider-indicator"]} />
                    <div className={style["property-feature"]}>
                        <div className={style["property-feature-row1"]}>
                            <div>
                                <img src={bedIcon} alt='' />
                                {property?.property_detail?.rooms?.bedroom ?? ""} BED
                            </div>
                            <div className={style["seperator"]}></div>
                            <div>
                                <img src={bathIcon} alt='' />
                                {property?.property_detail?.rooms?.bathroom ?? ""} BATH
                            </div>
                            {
                                //<div className={style["seperator"]}></div>
                                //<div>1250 SQ.</div>
                            }
                        </div>
                        <div className={style["property-feature-row2"]}>
                            <div>{property?.property_type.name?.toUpperCase()}</div>
                            <div>|</div>
                            <div>{property?.property_subtype.name?.toUpperCase()}</div>
                        </div>
                    </div>

                </div>
                <div className={style["rateinfo"]}>
                    <div className={style["rateinfo-text"]}>
                        <div>
                            Monthly rent share
                        </div>
                        <i ref={breakdownQuestionRef} className='fas fa-question' />
                        {
                            //  <div style={{ display: priceBreakdownOpen ? "" : "none" }} className={style["ratebreakdown"]}>
                            //      <div className={style["ratebreakdown-item"]}>
                            //          <div>Utilities included</div>
                            //          <ul>
                            //              <li>Electricity,Water, Maintenence</li>
                            //          </ul>
                            //      </div>
                            //      <div className={style["ratebreakdown-item"]}>
                            //          <div>C${property?.property_detail?.rent_amount ?? ""}: Booking amount</div>
                            //          <ul>
                            //              <li>Rent deposit(first &amp; last)</li>
                            //              <li>Key deposit</li>
                            //          </ul>
                            //      </div>
                            //  </div>
                        }
                    </div>
                    <div className={style["rateinfo-rate"]} >C$ {property?.property_detail?.rent_amount ?? ""}</div>
                </div>
                <div className={style["description"]}>
                    {property?.description}
                </div>
                <Accordion allowMultipleExpanded allowZeroExpanded preExpanded={["0"]}>
                    <AccordionItem uuid="0">
                        <AccordionItemHeading>
                            <AccordionItemButton>
                                About the property
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <ul className={style["feature-accordion-list"]}>
                                <li>Address: {property?.property_address?.address?.full_address}</li>
                                <li>Building Amenities: {property?.property_detail?.features ? property?.property_detail?.features?.join(",") : "-"}</li>
                                <li>Bedroom x {property?.property_detail?.rooms?.bedroom}</li>
                                <li>Bathroom x {property?.property_detail?.rooms?.bathroom}</li>
                                <li>Parking: {property?.property_detail?.rooms?.parking}</li>
                                <li>Restrictions: {property?.property_detail?.restrictions?.length ? property?.property_detail?.restrictions?.join(",") : "-"}</li>
                                <li>Maximum occupants: {property?.property_detail?.max_occupants}</li>
                            </ul>
                        </AccordionItemPanel>
                    </AccordionItem>
                </Accordion>

                <div className={style["bottom-panel"]}>
                    <ButtonSolid disabled={!!auth?.user?.role.some((role) => role === Roles['landlord'] || role === Roles['admin'])} className={style["bottom-panel-sendbtn"]} onClick={() => navigate("/sendRequest?id=" + property?.id)}>Send request</ButtonSolid>

                    {
                        //                   <button className={style["bottom-panel-icon"]}>
                        //                     <i onClick={() => setNotify(!notify)} className={`${notify ? style["notifyfilled"] + " fas" : " far"} fa-bell`}></i>
                        //                   </button>
                    }
                    <FavButton control={favControl} hide={skipFav} />
                    <button onClick={() => {
                        navigator.clipboard.writeText(window.location.href).then(d => toast.success("Link copied."))
                    }} className={style["bottom-panel-shareicon"]}>
                        <img src={forwardIcon} alt="" />
                    </button>
                </div>
            </div>
        </Layout>
    );
}