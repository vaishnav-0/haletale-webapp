import React from 'react';
import style from './RadioButton.module.scss';
import { RadioButton } from './ToggleButtons';
import { InputPropsType } from './types';

export interface PropsType extends InputPropsType {
    name: string
    values: string[] | { [index: string]: string },
    defaultValue?: string,
}

const RadioButtonGroup = React.forwardRef<HTMLInputElement, PropsType>(({ name, values, type, defaultValue, ...rest }: PropsType, ref) => {
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

export { RadioButtonGroup };