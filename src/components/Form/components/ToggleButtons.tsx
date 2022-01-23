import React from 'react';
import { InputPropsType } from './types';
import style from './ToggleButtons.module.scss';

export interface PropsType extends InputPropsType {
    label?: string
    type?: "radio" | "checkbox"
}

const ToggleButton = React.forwardRef<HTMLInputElement, PropsType>(({ name, value, label, type, key, children, ...rest }: PropsType, ref) => {

    const id = Math.random().toString(36).substr(2, 5);
    return (
        <label htmlFor={id}>
            <div key={key} className={style["radio-item"]}>
                {
                    type === "radio" ?
                        <input {...rest} type="radio" id={id} name={name} value={value} ref={ref} />
                        :
                        <input {...rest} type="checkbox" id={id} name={name} value={value} ref={ref} />
                }
                <div className={style["checked"]}>
                    <i className={`far ${type === "radio" ? "fa-dot-circle" : "fa-check-square"}`} />
                </div>
                <div className={style["unchecked"]}>
                    <i className={`far ${type === "radio" ? "fa-circle" : "fa-square"}`} />
                </div>
                <div className={style["label"]}>
                    {children ?? label ?? value}
                </div>
            </div>
        </label>
    );
});
export default ToggleButton;
export const RadioButton = React.forwardRef<HTMLInputElement, PropsType>((props: PropsType, ref) => {
    return <ToggleButton {...props} type="radio" ref={ref} />
});

export const CheckBox = React.forwardRef<HTMLInputElement, PropsType>((props: PropsType, ref) => {
    return <ToggleButton {...props} type="checkbox" ref={ref} />
});