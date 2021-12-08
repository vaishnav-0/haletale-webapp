import React from 'react';
import './MinimalPropertyList.scss';
import PropertyCard from './PropertyCard';

export default function () {
    const listRef = React.useRef(null);
    const scrollLeftList = () => {
        listRef.current.scrollBy({
            top: 0,
            left: -300,
            behavior: 'smooth'
        });
    }
    const scrollRightList = () => {
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
                <div className="list-heading">Popular properties</div>
                <button class="list-more-btn">SEE ALL</button>
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