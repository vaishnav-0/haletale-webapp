import React from 'react';
import style from './ToggleButtons.module.scss';
interface props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    name: string
    value: string
    label?: string
    type?: "radio" | "checkbox"
}
function ToggleButton({ name, value, label, type, key }: props): JSX.Element {
    const id = Math.random().toString(36).substr(2, 5);
    return (
        <div key={key} className={style["radio-item"]}>
            {
                type === "radio" ?
                    <input type="radio" id={id} name={name} value={value} />
                    :
                    <input type="checkbox" id={id} name={name} value={value} />
            }
            <div className={style["checked"]}>
                <i className={`far ${type === "radio" ? "fa-dot-circle" : "fa-check-square"}`} />
            </div>
            <div className={style["unchecked"]}>
                <i className={`far ${type === "radio" ? "fa-circle" : "fa-square"}`} />
            </div>
            <label htmlFor={id}>{label ? label : value}</label>
        </div>
    );
}
export function RadioButton(props: props): JSX.Element {
    return <ToggleButton type="radio" {...props} />
}
export function CheckBox(props: props): JSX.Element {
    return <ToggleButton type="checkbox" {...props} />
}