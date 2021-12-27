import React from "react";
import { useClickOutsideEvent } from '../functions/hooks/useClickOutsideEvent';

type OpenableProps = {
    children?: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,
    open: [boolean, (a: boolean) => void],
    clickOutsideCloseException?: React.MutableRefObject<HTMLElement>[],

}

const Openable = function ({ children, className, style, open, clickOutsideCloseException }: OpenableProps): JSX.Element {
    const ref = React.useRef<HTMLDivElement>(null!);
    useClickOutsideEvent(ref, () => open[1](false), clickOutsideCloseException);
    return (< div ref={ref} className={className} style={{ ...style, display: !open[0] ? "none" : "revert" }
    } >
        {
            children
        }
    </div>
    );

}

export { Openable };