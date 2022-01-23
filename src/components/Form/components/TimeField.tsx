import React from 'react';
import style from './TextInput.module.scss';
import { InputPropsType } from './types';
export interface PropsType extends InputPropsType {
    type: "date" | "month" | "week" | "time" | "datetime-local";
}
export const TimeField = React.forwardRef<HTMLInputElement, PropsType>((inputProps: PropsType, ref) => {
    return (
        <div className={style["textbox"]}>
            <input {...inputProps} ref={ref} />
        </div>
    );
});