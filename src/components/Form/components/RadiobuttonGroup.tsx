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
    let elements = [];
    if (Array.isArray(values))
        elements = values.map((e, i) => {
            const id = Math.random().toString(36).substr(2, 5);
            return (
                <RadioButton key={i} name={name} {...rest} value={e} ref={ref} />
            );
        });
    else
        elements = Object.entries(values).map(([value, label], i) => {
            const id = Math.random().toString(36).substr(2, 5);
            return (
                <RadioButton key={i} name={name} {...rest} value={value} label={label} ref={ref}
                    {...defaultValue === value ? { defaultChecked: true } : {}}
                />
            );
        })
    return (<>
        {
            elements
        }
    </>
    );
});

export { RadioButtonGroup };