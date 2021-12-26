import React from 'react';
import "./Button.scss";
type props ={
    label: string;
}
export function ButtonHollow({ label }: props): JSX.Element {
    return <button className="btn-smoothround-hollow">{label}</button>

}
export function ButtonSolid({ label }: props): JSX.Element {
    return <button className="btn-smoothround-solid">{label}</button>

}