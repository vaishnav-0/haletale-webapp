import React from 'react';
import style from './Select.module.scss';
import { SelectPropsType } from './types';
export interface PropsType extends SelectPropsType {
    values: {
        [index: string]: string;
    }
}
export type ElementType = typeof Select;

export const Select = React.forwardRef<HTMLSelectElement, PropsType>(({ values, ...inputProps }: PropsType, ref) => {
    return (
        <div className={style["box"]}>
            <select {...inputProps} ref={ref}>
                {
                    Object.entries(values).map(([value, label]) => {
                        return < option value={value} > {label}</option>
                    })
                }
            </select>
            <i className={style["down"] + ' fas fa-chevron-down'} />
        </div >
    );
});