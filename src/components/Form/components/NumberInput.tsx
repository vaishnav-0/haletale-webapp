import React from 'react';
import PropertySearchListing from '../../../pages/PropertySearchListing';
import style from './NumberInput.module.scss';

type changeFuncType = (v: number) => void;
type props = {
    value: number
    init?: number,
    min?: number,
    max?: number | null,
    disabled?: (0 | 1)[],
    onChange?: changeFuncType,
    onIncrement?: changeFuncType,
    onDecrement?: changeFuncType,
    setValue?: changeFuncType,

}
export function NumberInput({ value, min = 0, max, disabled = [], onChange, onIncrement, onDecrement, setValue = () => { } }: props): JSX.Element {
    return (
        <div className={style["container"]}>
            <button type="button"
                className={value === min || disabled.includes(0) ? style["inactive"] : ""}
                onClick={() => {
                    if (!disabled.includes(0) && value > min) {
                        onChange && onChange(value - 1);
                        onDecrement && onDecrement(value - 1);
                        setValue(value - 1);
                    }
                }}>
                <i className="fas fa-minus"></i>
            </button>
            <div className={style["count"]}>
                {value}
            </div>
            <button type="button"
                className={value === max || disabled.includes(1) ? style["inactive"] : ""}
                onClick={() => {
                    if (!disabled.includes(1) && (max == null || value != max)) {
                        onChange && onChange(value + 1);
                        onIncrement && onIncrement(value + 1);
                        setValue(value + 1);
                    }
                }}>
                <i className="fas fa-plus"></i>
            </button>
        </div>
    );
}