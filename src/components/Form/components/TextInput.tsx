import React from 'react';
import style from './TextInput.module.scss';
import { InputPropsType } from './types';
export interface PropsType extends InputPropsType {
    type: "text" | "password" | "number";
}

export const TextInput = React.forwardRef<HTMLInputElement, PropsType>(({ children, ...inputProps }: PropsType, ref) => {
    console.log("textInput");
    return (
        <div className={style["textbox"]}>
            <input {...inputProps} ref={ref} />
            {
                children
            }
        </div>
    );
});