import React from "react";
import { useClickOutsideEvent } from './useClickOutsideEvent';

type args = {
    clickOutsideClose?: boolean,
    clickOutsideCloseException?: HTMLElement[],
    onClose?: () => void,
    onOpen?: () => void,
}
type ret = {
    props: {
        refer?: React.MutableRefObject<any>
        open: boolean
    },
    isOpen: boolean,
    setOpen: (state: boolean) => void,
    setClickOutsideExceptions: (e: HTMLElement[]) => void
}
export function useOpenable({
    clickOutsideClose = true,
    clickOutsideCloseException,
    onOpen = () => { },
    onClose = () => { },
}: args): ret {
    const [open, setOpen] = React.useState(false);
    const excluded = React.useRef<HTMLElement[]>([]);
    if (clickOutsideCloseException)
        excluded.current = clickOutsideCloseException;
    const openFunc = (s: boolean = true) => {
        setOpen(s);
        s ? onOpen() : onClose();
    }
    const ref = React.useRef<HTMLDivElement>(null!);
    useClickOutsideEvent(ref, () => setOpen(false), excluded.current);
    console.log(excluded.current);
    return {
        props: {
            refer: ref,
            open: open
        },
        isOpen: open,
        setOpen: openFunc,
        setClickOutsideExceptions: (el) => { excluded.current = el }
    }
}
type OpenableProps = {
    children?: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,
    refer?: React.MutableRefObject<any>
    open: boolean
}

const Openable = function ({ children, className, style, refer, open = false }: OpenableProps): JSX.Element {
    return (< div ref={refer} className={className} style={{ ...style, display: !open ? "none" : "revert" }
    } >
        {
            children
        }
    </div>
    );

}

export { Openable };