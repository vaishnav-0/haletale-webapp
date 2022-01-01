import React from 'react';
import "./Button.scss";
interface propsType extends React.HTMLAttributes<HTMLButtonElement> {
    label: string;
    onClick?: () => void;
    className?: string
}
export type ButtonComponentType = (props: propsType) => JSX.Element
export const ButtonHollow: ButtonComponentType = function ({ label, onClick = () => { }, className = "" }) {
    return <button onClick={onClick} className={"btn-smoothround-hollow " + className}> {label}</button >

}
export const ButtonSolid: ButtonComponentType = function ({ label, onClick = () => { }, className = "" }) {
    return <button onClick={onClick} className={"btn-smoothround-solid " + className}>{label}</button>

}