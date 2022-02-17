import React from 'react';
import { useNavigate } from "react-router-dom";
import style from "./Searchbar.module.scss";
import searchIcon from "../assets/icons/search.png";
import debounce from '../functions/debounce';
const debouncedCall = debounce((v: any) => console.log(v.target.value), 1000);
export default function (): JSX.Element {
    let navigate = useNavigate();
    return (
        <div className={style["searchbox-container"]}>
            <div className={style["searchbox-input-field"]}>
                <input placeholder="Search Property, Neighbourhood or Address" type="text"
                    onChange={debouncedCall}
                />
            </div>
            <div className={style["searchbox-btn"]}>
                <button onClick={() => {
                    navigate("/properties");
                }}>
                    <img src={searchIcon} />
                </button>
            </div>
            {
                false &&
                <div className={style["suggestions-container"]}>
                    <button>Place 1</button>
                    <button>Place 2</button>
                    <button>Place 3</button>
                </div>
            }
        </div>
    );
}