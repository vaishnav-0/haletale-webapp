import React from 'react';
import style from './NumberInput.module.scss';

type changeFuncType = (v: number) => void;
export type PropsType = {
    init?: number,
    min?: number,
    max?: number | null,
    disabledBtn?: (0 | 1)[],
    onChange?: changeFuncType,
    onIncrement?: changeFuncType,
    onDecrement?: changeFuncType,
    onBlur?: () => void,
    setValueRef?: React.MutableRefObject<((v: number) => void) | undefined>,
    key?: React.Attributes["key"],
    disabled?: boolean,
    defaultValue?: number,
    minLabel?: string
    steps?:number
}
export function NumberInput({ init = 0, min = 0, max, disabledBtn = [], onChange = () => { }
    , onIncrement, onDecrement, setValueRef, key, disabled, defaultValue, minLabel,steps=1 }: PropsType): JSX.Element {
    if (disabled)
        disabledBtn = [0, 1];
    const _defaultValue = defaultValue ?
        defaultValue >= min ? defaultValue : min
        : defaultValue;
    const _init = init >= min ? init : min
    const [count, setCount] = React.useState(_defaultValue ?? _init);
    if (setValueRef)
        setValueRef.current = setCount;
    React.useEffect(() => onChange(_defaultValue ?? _init), []);
    return (
        <div key={key} className={style["container"]}>
            <button type="button"
                className={count === min || disabledBtn.includes(0) ? style["inactive"] : ""}
                onClick={() => {
                    if (!disabledBtn.includes(0) && count > min) {
                        onChange && onChange(count - steps);
                        onDecrement && onDecrement(count - steps);
                        setCount(count - steps);
                    }
                }}>
                <i className="fas fa-minus"></i>
            </button>
            <div className={style["count"]}>
                {
                    count === min ?
                        minLabel ?? count
                        :
                        count
                }
            </div>
            <button type="button"
                className={count === max || disabledBtn.includes(1) ? style["inactive"] : ""}
                onClick={() => {
                    if (!disabledBtn.includes(1) && (max == null || count != max)) {
                        onChange && onChange(count + steps);
                        onIncrement && onIncrement(count + steps);
                        setCount(count + steps);
                    }
                }}>
                <i className="fas fa-plus"></i>
            </button>
        </div>
    );
}