import React from 'react';
import style from './RadioButton.module.scss';

type props = {
    name: string
    values: string[]
}
const RadioButton = function ({ name, values }: props): JSX.Element {
    return (<ul className={style["list"]}>
        {values.map(e => {
            const id = Math.random().toString(36).substr(2, 5);
            return (
                <li className={style["list-item"]}>
                    <input type="radio" id={id} name={name} value={e} />
                    <div className={style["checked"]}>
                        <i className="far fa-dot-circle" />
                    </div>
                    <div className={style["unchecked"]}>
                        <i className="far fa-circle" />
                    </div>
                    <label htmlFor={id}>{e}</label>
                </li>
            );
        })}
    </ul>
    );
}

export default RadioButton;