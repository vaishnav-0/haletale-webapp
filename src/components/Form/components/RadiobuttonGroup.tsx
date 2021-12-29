import React from 'react';
import style from './RadioButton.module.scss';
import RadioButton from './RadioButton';

type props = {
    name: string
    values: string[]
}
const RadioButtonGroup = function ({ name, values }: props): JSX.Element {
    return (<>
        {values.map(e => {
            const id = Math.random().toString(36).substr(2, 5);
            return (
                <RadioButton name={name} value={e} />
            );
        })}
    </>
    );
}

export default RadioButtonGroup;