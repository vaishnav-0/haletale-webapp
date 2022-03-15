import React from 'react';
import './MinimalPropertyList.scss';
import PropertyCard from './PropertyCard';
import { IPropertyDetails } from '../queries/property.query';
import { useNavigate } from 'react-router-dom';
type props = {
    title: string;
    properties: IPropertyDetails[];
}
export default function ({ title, properties }: props): JSX.Element {
    const navigate = useNavigate();
    const listRef = React.useRef<HTMLDivElement>(null);
    const scrollLeftList = () => {
        if (!listRef.current) throw Error("divRef is not assigned");
        listRef.current.scrollBy({
            top: 0,
            left: -300,
            behavior: 'smooth'
        });
    }
    const scrollRightList = () => {
        if (!listRef.current) throw Error("divRef is not assigned");
        listRef.current.scrollBy({
            top: 0,
            left: 300,
            behavior: 'smooth'
        });
    }
    return (
        <div className="property-list">
            <div className="list-heading-container">
                <div className="list-heading">{title}</div>
                <button onClick={()=>navigate("/properties")} className="list-more-btn">SEE ALL</button>
            </div>
            <div className="minimal-list-container-wrapper">
                <div ref={listRef} className="minimal-list-container">
                    {
                        properties.map((property) => <PropertyCard key={property.id} property={property} />)
                    }{
                        properties.length > 0 &&
                        <>
                            <button className="left-scroll-btn" onClick={scrollLeftList}>
                                &lt;
                            </button>
                            <button className="right-scroll-btn" onClick={scrollRightList}>
                                &gt;
                            </button>
                        </>
                    }

                </div>
            </div>
        </div>



    );
}