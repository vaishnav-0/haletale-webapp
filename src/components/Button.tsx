import React from 'react';
import "./Button.scss";
interface propsType extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    label: string;
    onClick?: () => void;
    className?: string
}
export type ButtonComponentType = React.FC<propsType>
export const ButtonHollow: ButtonComponentType = function ({ label, onClick = () => { }, className = "", ...rest }) {
    return <button onClick={onClick} className={"btn-smoothround-hollow " + className} {...rest}> {label}</button >

}
export const ButtonSolid: ButtonComponentType = function ({ label, onClick = () => { }, className = "", ...rest }) {
    return <button onClick={onClick} className={"btn-smoothround-solid " + className} {...rest}>{label}</button>

}