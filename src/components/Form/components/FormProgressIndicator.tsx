import React from "react";
import style from "./FormProgressIndicator.module.scss";
import { Oval } from 'react-loader-spinner';
type PropsType = {
    height?: number,
    indicator: string,
    state: ProgressStateEnum,
    description: string,
    onClick?: () => void
}
export enum ProgressStateEnum {
    Pending,
    OnProgress,
    Processing,
    Done
}
export default function FormProgressIndicator({ height = 120, indicator, state, description, onClick = () => { } }: PropsType) {
    return (
        <div className={style["progress-container"]} style={{ height: height + "px" }}>
            <div className={style["progress-symbols"]} >
                <div></div>
                <button
                    className={`${style["progress-btn"]}${(state === ProgressStateEnum.Done || state === ProgressStateEnum.OnProgress) ? " " + style["active"] : ''}`}
                    onClick={onClick}
                >
                    {state === ProgressStateEnum.Done ?
                        <i className="fas fa-check" /> :
                        state === ProgressStateEnum.Processing ?
                            <Oval secondaryColor="grey" strokeWidth={5} color="white" height={20} width={20} /> :
                            indicator
                    }
                </button>
                <div></div>
            </div>
            <div className={style["progress-description"]}>
                {description}
            </div>
        </div>

    )
}