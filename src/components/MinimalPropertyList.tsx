import React from 'react';
import './MinimalPropertyList.scss';
import PropertyCard from './PropertyCard';
type props = {
    title: string;
}
export default function ({ title }: props): JSX.Element {
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
    const listItems = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => <PropertyCard key={number.toString()} />);
    return (
        <div className="property-list">
            <div className="list-heading-container">
                <div className="list-heading">{title}</div>
                <button className="list-more-btn">SEE ALL</button>
            </div>
            <div className="minimal-list-container-wrapper">
                <div ref={listRef} className="minimal-list-container">
                    {listItems}
                    <button className="left-scroll-btn" onClick={scrollLeftList}>
                        &lt;
                    </button>
                    <button className="right-scroll-btn" onClick={scrollRightList}>
                        &gt;
                    </button>
                </div>
            </div>
        </div>



    );
}