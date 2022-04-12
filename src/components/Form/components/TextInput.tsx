import React from 'react';
import style from './TextInput.module.scss';
import { InputPropsType } from './types';
export interface PropsType extends InputPropsType {
    type: "text" | "password" | "number",
    height?: number
}

export const TextInput = React.forwardRef<HTMLInputElement, PropsType>(({ children, height, ...inputProps }: PropsType, ref) => {
    return (
        <div className={style["textbox"]} style={height ? { height: height + "px" } : {}}>
            <input {...inputProps} ref={ref} />
            {
                children
            }
        </div>
    );
});