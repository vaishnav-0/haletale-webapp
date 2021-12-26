import React from 'react';
import { useNavigate } from "react-router-dom";
import "./Searchbar.scss";
import searchIcon from "../assets/icons/search.png";
export default function (): JSX.Element {
    let navigate = useNavigate();
    return (
        <div className="searchbox-container">
            <div className="searchbox-input-field">
                <input placeholder="Search Property, Neighbourhood or Address" type="text" />
            </div>
            <div className="searchbox-btn">
                <button onClick={() => {
                    navigate("/properties");
                }}>
                    <img src={searchIcon} />
                </button>
            </div>
        </div>
    );
}