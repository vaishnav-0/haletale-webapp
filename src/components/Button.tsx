import React from 'react';
import "./Button.scss";
type props = {
    label: string;
    onClick?: () => void;
}
export function ButtonHollow({ label, onClick = () => { } }: props): JSX.Element {
    return <button onClick={onClick} className="btn-smoothround-hollow">{label}</button>

}
export function ButtonSolid({ label , onClick = () => { } }: props): JSX.Element {
    return <button onClick={onClick} className="btn-smoothround-solid">{label}</button>

}