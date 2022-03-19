import React from "react";
import style from './MessageBox.module.scss';

export interface PropsType {
    children: React.ReactNode,
    labelComponent: JSX.Element,
    style?: string,
    onClose?: () => void
}
export function MessageBox({ children, labelComponent, style: boxStyle = "", onClose = () => { } }: PropsType) {
    const [open, setOpen] = React.useState<boolean>(true);
    return <div className={style["container"]}>
        <button type="button" onClick={() => setOpen(p => !p)} className={style["label-btn"]}>
            {labelComponent}
        </button>
        {open &&
            <div className={style["content"] + " " + boxStyle}>
                <button type="button" onClick={() => { setOpen(false); onClose() }} className={style["close-btn"]}>
                    <i className="fas fa-times" />
                </button>
                {children}
            </div>
        }
    </div>
}

export function InfoMessageBox(props: { message: string | JSX.Element }) {
    return (
        <MessageBox labelComponent={<i className="fas fa-info-circle" />}>
            <div className={style["message-box"]} >
                {props.message}
            </div>
        </MessageBox>
    );
}