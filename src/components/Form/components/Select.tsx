import React from 'react';
import style from './Select.module.scss';

interface props extends React.HTMLAttributes<HTMLSelectElement> {
    values: {
        [index: string]: string;
    }
}
export function Select({ values, ...inputProps }: props): JSX.Element {
    return (
        <div className={style["box"]}>
            <select {...inputProps} >
                {
                    Object.entries(values).map(([value, label]) => {
                        return < option value={value} > {label}</option>
                    })
                }
            </select>
            <i className='fas fa-chevron-down'/>
        </div >
    );
}