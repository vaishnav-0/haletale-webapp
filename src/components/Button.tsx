import React from 'react';
import "./Button.scss";
interface props extends React.HTMLAttributes<HTMLButtonElement> {
    label: string;
    onClick?: () => void;
    className?: string
}
export function ButtonHollow({ label, onClick = () => { }, className }: props): JSX.Element {
    return <button onClick={onClick} className={"btn-smoothround-hollow " + className}>{label}</button>

}
export function ButtonSolid({ label, onClick = () => { }, className }: props): JSX.Element {
    return <button onClick={onClick} className={"btn-smoothround-solid " + className}>{label}</button>

}