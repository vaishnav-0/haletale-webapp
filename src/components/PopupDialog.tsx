import React from "react";
import { Openable } from "./Openable";
import style from './PopupDialog.module.scss';

type PropsType = {
    message: string,
    onConfirm: () => void,
    onReject: () => void,
    openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}
export default function PopupDialog(props: PropsType) {
    return <Openable open={props.openState}>
        <div className={style["container"]} >
            <button onClick={() => props.openState[1](false)} className={style["btn-close"]}><i className="fas fa-times"></i></button>
            <div className={style["message"]}>
                {
                    props.message
                }
            </div>
            <div className={style["btn-container"]}>
                <button onClick={() => { props.onConfirm(); props.openState[1](false) }} className={style["btn-conf"]}><i className="fas fa-check"></i></button>
                <button onClick={() => { props.onReject(); props.openState[1](false) }} className={style["btn-rej"]}><i className="fas fa-ban"></i></button>
            </div>
        </div>
    </Openable>
}

export function usePopupDialog(): [JSX.Element, (state: boolean, message: string, onConfirm?: (() => void) | undefined, onReject?: (() => void) | undefined) => void] {
    const [open, setOpen] = React.useState<boolean>(false);
    const onConfirmRef = React.useRef(() => { });
    const onRejectRef = React.useRef(() => { });
    const messageRef = React.useRef("");
    const expFn = React.useCallback((state: boolean, message: string, onConfirm?: () => void, onReject?: () => void) => {
        if (!state) {
            setOpen(state)
            return;
        }
        messageRef.current = message;
        onConfirmRef.current = onConfirm ?? (() => { });
        onRejectRef.current = onReject ?? (() => { });
        setOpen(state);
    }, [])
    return [<PopupDialog openState={[open, setOpen]} message={messageRef.current} onConfirm={onConfirmRef.current} onReject={onRejectRef.current} />,
        expFn
    ]
}