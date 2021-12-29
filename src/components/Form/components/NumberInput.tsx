import React from 'react';
import style from './NumberInput.module.scss';
type props = {
    init?: number,
    min?: number,
    max?: number | null
}
export function NumberInput({ init = 0, min = 0, max }: props): JSX.Element {
    const [count, setCount] = React.useState(0)
    return (
        <div className={style["container"]}>
            <button type="button"
                className={count === min ? style["inactive"] : ""}
                onClick={() => {
                    count > min && setCount(count - 1);
                }}>
                <i className="fas fa-minus"></i>
            </button>
            <div className={style["count"]}>
                {count}
            </div>
            <button type="button"
                className={count === max ? style["inactive"] : ""}
                onClick={() => {
                    (max != null && count == max) || setCount(count + 1)
                }}>
                <i className="fas fa-plus"></i>
            </button>
        </div>
    );
}