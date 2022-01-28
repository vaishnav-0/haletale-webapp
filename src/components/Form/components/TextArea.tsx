import React from 'react';
import style from './TextArea.module.scss';
import { TextAreaPropsType } from './types';
export interface PropsType extends TextAreaPropsType {
    rows?: number,
    cols?: number
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, PropsType>((inputProps: PropsType, ref) => {
    return (
        <div className={style["textbox"]}>
            <textarea {...inputProps} ref={ref}/>
        </div>
    );
});