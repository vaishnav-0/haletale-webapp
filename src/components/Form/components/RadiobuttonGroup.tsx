import React from 'react';
import style from './RadioButton.module.scss';
import { RadioButton, CheckBox } from './ToggleButtons';
import { InputPropsType } from './types';

export interface RadioButtonGroupPropsType extends InputPropsType {
    name: string
    values: string[] | { [index: string]: string },
    defaultValue?: string,
}
export interface CheckBoxGroupPropsType extends InputPropsType {
    name: string
    values: string[] | { [index: string]: string },
    defaultValue?: string[],
}

const RadioButtonGroup = React.forwardRef<HTMLInputElement, RadioButtonGroupPropsType>(({ name, values, type, defaultValue, ...rest }: RadioButtonGroupPropsType, ref) => {
    const values_ = Array.isArray(values) ? Object.fromEntries(values.map(e => [e, e])) : values;
    return <>
        {Object.entries(values_).map(([value, label], i) => {
            return (
                <RadioButton key={i} name={name} {...rest} value={value} label={label} ref={ref}
                    {...defaultValue === value ? { defaultChecked: true } : {}}
                />
            );
        })
        }
    </>
});
const CheckBoxGroup = React.forwardRef<HTMLInputElement, CheckBoxGroupPropsType>(({ name, values, type, defaultValue, ...rest }: CheckBoxGroupPropsType, ref) => {
    const values_ = Array.isArray(values) ? Object.fromEntries(values.map(e => [e, e])) : values;
    return <>
        {
            Object.entries(values_).map(([value, label], i) => {
                return (
                    <CheckBox key={i} name={name} {...rest} value={value} label={label} ref={ref}
                        {...defaultValue?.includes(value) ? { defaultChecked: true } : {}}
                    />
                );
            })
        }
    </>
});

export { RadioButtonGroup, CheckBoxGroup };