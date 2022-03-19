import React from "react";
import { Openable } from "./Openable";
import style from './PopupDialog.module.scss';

type PropsType = {
    message: string,
    onConfirm: () => void,
    onReject: () => void
}
export default function PopupDialog(props: PropsType) {
    const openState = React.useState<boolean>(false);
    return <Openable open={openState}>
        <div>
            <button className={style["btn-close"]}><i className="fas fa-times"></i></button>
            <div className={style["message"]}>
                {
                    props.message
                }
            </div>
            <div className={style["btn-container"]}>
                <button onClick={props.onConfirm} className={style["btn-conf"]}><i className="fas fa-check"></i></button>
                <button onClick={props.onReject} className={style["btn-rej"]}><i className="fas fa-times"></i></button>
            </div>
        </div>
    </Openable>
}