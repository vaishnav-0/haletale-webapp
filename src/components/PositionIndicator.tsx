import React from 'react';
import style from "./PositionIndicator.module.scss";
type PropType = {
    count: number,
    position: number
}
export default function ({ count, position }: PropType): JSX.Element {
    console.log(Array(count));
    return (
        <div className={style["indicator-container"]}>
            {
                [...Array(count)].map((e, i) => <div className={position === i + 1 ? style["active"] : ""}></div>)
            }
        </div>
    );
}