import React from 'react';
import style from './NumberInput.module.scss';

export function NumberInput({ init = 0, min = 0, max  }) {
    const [count, setCount] = React.useState(0)
    return (
        <div className={style["container"]}>
            <button onClick={() => {
                count > min && setCount(count - 1);
            }}><i className="fas fa-plus"></i></button>
            <div className={style["count"]}>
                {count}
            </div>
            <button onClick={() => {
                (max != null && count == max) || setCount(count + 1)
            }}><i className="fas fa-minus"></i></button>
        </div>
    );
}