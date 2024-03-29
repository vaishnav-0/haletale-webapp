import React from 'react';
import style from './RadioButton.module.scss';
import { RadioButton } from './ToggleButtons';

type props = {
    name: string
    values: string[] | { [index: string]: string }
}
const RadioButtonGroup = function ({ name, values }: props): JSX.Element {
    let elements = [];
    if (Array.isArray(values))
        elements = values.map((e, i) => {
            const id = Math.random().toString(36).substr(2, 5);
            return (
                <RadioButton key={i} name={name} value={e} />
            );
        });
    else
        elements = Object.entries(values).map(([value, label], i) => {
            const id = Math.random().toString(36).substr(2, 5);
            return (
                <RadioButton key={i} name={name} value={value} label={label} />
            );
        })
    return (<>
        {
            elements
        }
    </>
    );
}

export default RadioButtonGroup;