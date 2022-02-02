import React from "react";
import style from './MessageBox.module.scss';

export interface PropsType {
    children: React.ReactNode,
    labelComponent: JSX.Element,
    style?: string
}
export function MessageBox({ children, labelComponent, style: boxStyle = "" }: PropsType) {
    const [open, setOpen] = React.useState<boolean>(true);
    return <div className={style["container"]}>
        <button type="button" onClick={() => setOpen(p => !p)} className={style["label-btn"]}>
            {labelComponent}
        </button>
        {open &&
            <div className={style["content"] + " " + boxStyle}>
                <button type="button" onClick={() => setOpen(false)} className={style["close-btn"]}>
                    <i className="fas fa-times" />
                </button>
                {children}
            </div>
        }
    </div>
}