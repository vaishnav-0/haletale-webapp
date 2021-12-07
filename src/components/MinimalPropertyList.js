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
        <div>
            <div ref={listRef} className="minimal-list-container">
                {listItems}
            </div>
            <button onClick={scrollLeftList}>
                left
            </button>
            <button onClick={scrollRightList}>
                right
            </button>
        </div>


    );
}