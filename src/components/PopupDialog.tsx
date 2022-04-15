import React from "react";
import { Openable } from "./Openable";
import style from './PopupDialog.module.scss';

type PropsType = {
    message: string | ((confirm: () => void, reject: () => void, close: () => void) => JSX.Element),
    onConfirm: () => void,
    onReject: () => void,
    openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
    buttonsVisible?: boolean
}
export default function PopupDialog(props: PropsType) {
    return <Openable open={props.openState}>
        <div className={style["container"]} >
            <button onClick={() => props.openState[1](false)} className={style["btn-close"]}><i className="fas fa-times"></i></button>
            <div className={style["message"]}>
                {
                    typeof props.message === 'string' ?
                        props.message
                        :
                        props.message(props.onConfirm, props.onReject, () => props.openState[1](false))
                }
            </div>
            {
                props.buttonsVisible &&
                <div className={style["btn-container"]}>
                    <button onClick={() => { props.onConfirm(); props.openState[1](false) }} className={style["btn-conf"]}><i className="fas fa-check"></i></button>
                    <button onClick={() => { props.onReject(); props.openState[1](false) }} className={style["btn-rej"]}><i className="fas fa-ban"></i></button>
                </div>
            }
        </div>
    </Openable>
}

export function usePopupDialog(props: Partial<Omit<PropsType, "openState">> = {}):
    [
        JSX.Element,
        (state: boolean, message?: PropsType["message"], onConfirm?: (() => void) | undefined, onReject?: (() => void) | undefined) => void
    ] {
    const { buttonsVisible = true, message = "", onConfirm = () => { }, onReject = () => { } } = props;
    const [open, setOpen] = React.useState<boolean>(false);
    const onConfirmRef = React.useRef(() => { });
    const onRejectRef = React.useRef(() => { });
    const messageRef = React.useRef<PropsType["message"]>("");
    const expFn = React.useCallback((state: boolean, msg?: PropsType["message"], onCnf?: () => void, onRej?: () => void) => {
        if (!state) {
            setOpen(state)
            return;
        }
        messageRef.current = msg ?? message;
        onConfirmRef.current = onCnf ?? onConfirm;
        onRejectRef.current = onRej ?? onReject;
        setOpen(state);
    }, [])
    return [<PopupDialog buttonsVisible={buttonsVisible} openState={[open, setOpen]} message={messageRef.current} onConfirm={onConfirmRef.current} onReject={onRejectRef.current} />,
        expFn
    ]
}