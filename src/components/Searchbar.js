import React from 'react';
import "./Searchbar.scss";
import searchIcon from "../assets/icons/search.png";
export default function(){
    return(
        <div className="searchbox-container">
            <div className="searchbox-input-field">
                <input placeholder="Search Property, Neighbourhood or Address" type="text"/>
            </div>
            <div className="searchbox-btn">
                <button>
                    <img src={searchIcon}/>
                </button>
            </div>
        </div>
    );
}