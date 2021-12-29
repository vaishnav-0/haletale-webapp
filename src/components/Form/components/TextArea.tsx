import React from 'react';
import style from './TextArea.module.scss';

export function TextArea(inputProps: React.TextareaHTMLAttributes<HTMLTextAreaElement>): JSX.Element {
    return (
        <div className={style["textbox"]}>
            <textarea {...inputProps} />
        </div>
    );
}