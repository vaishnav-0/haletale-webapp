import React from 'react';
import style from './TextInput.module.scss';
interface props extends React.HTMLAttributes<HTMLInputElement> {
    type: "date" | "month" | "week" | "time" | "datetime-local";
}
export function TimeField(inputProps: props): JSX.Element {
    return (
        <div className={style["textbox"]}>
            <input {...inputProps} />
        </div>
    );
}