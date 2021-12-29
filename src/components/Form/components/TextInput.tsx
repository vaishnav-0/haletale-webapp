import React from 'react';
import style from './TextInput.module.scss';
interface props extends React.HTMLAttributes<HTMLInputElement> {
    type: "text" | "password";
}
export function TextInput({ children, ...inputProps }: props): JSX.Element {
    return (
        <div className={style["textbox"]}>
            <input {...inputProps} />
            {
                children
            }
        </div>
    );
}