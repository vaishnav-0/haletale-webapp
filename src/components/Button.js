import React from 'react';
import "./Button.scss";
export function ButtonHollow({ label }) {
    return <button className="btn-smoothround-hollow">{label}</button>

}
export function ButtonSolid({ label }) {
    return <button className="btn-smoothround-solid">{label}</button>

}