import React from 'react';
import style from './RadioButton.module.scss';
type props = {
    name: string
    value: string
    label?: string
}
export default function RadioButton({ name, value, label }: props): JSX.Element {
    const id = Math.random().toString(36).substr(2, 5);
    return (
        <div className={style["radio-item"]}>
            <input type="radio" id={id} name={name} value={value} />
            <div className={style["checked"]}>
                <i className="far fa-dot-circle" />
            </div>
            <div className={style["unchecked"]}>
                <i className="far fa-circle" />
            </div>
            <label htmlFor={id}>{label ? label : value}</label>
        </div>
    );
}