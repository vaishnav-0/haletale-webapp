import React from 'react';
import "./Button.scss";
interface propsType extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    label?: string;
    onClick?: () => void;
    className?: string
}
export type ButtonComponentType = React.FC<propsType>
export const ButtonHollow: ButtonComponentType = function ({ children, onClick = () => { }, className = "", ...rest }) {
    return <button onClick={onClick} className={"btn-smoothround-hollow " + className} {...rest}>
        {children}
    </button >

}
export const ButtonSolid: ButtonComponentType = function ({ children, onClick = () => { }, className = "", ...rest }) {
    return <button onClick={onClick} className={"btn-smoothround-solid " + className} {...rest}>
        {children}
    </button>

}