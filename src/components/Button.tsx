import React from 'react';
import style from "./Button.module.scss";
interface PropsType extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    label?: string;
    className?: string
}
export type ButtonComponentType = React.FC<PropsType>
export const ButtonHollow: ButtonComponentType = function ({ children, onClick = () => { }, className = "", ...rest }) {
    return <button onClick={onClick} className={style["btn-smoothround-hollow"] + " " + className} {...rest}>
        {children}
    </button >

}
export const ButtonSolid: ButtonComponentType = function ({ children, onClick = () => { }, className = "", ...rest }) {
    return <button onClick={onClick} className={style["btn-smoothround-solid"] + " " + className} {...rest}>
        {children}
    </button>

}