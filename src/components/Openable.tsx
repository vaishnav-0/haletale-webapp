import React from "react";
import { clickOutsideEvent } from '../functions/domEvents';

type OpenableProps = {
    children?: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,
    open: [boolean, (a: boolean) => void],
    closeOnClickOutside?: boolean,
    clickOutsideCloseException?: React.MutableRefObject<HTMLElement>[],

}

const Openable = function ({ children, className, style, open, clickOutsideCloseException, closeOnClickOutside = true }: OpenableProps): JSX.Element {
    const ref = React.useRef<HTMLDivElement>(null!);
    if (closeOnClickOutside)
        clickOutsideEvent(ref, () => open[1](false), clickOutsideCloseException);
    return (< div ref={ref} className={className} style={{ ...style, display: !open[0] ? "none" : "revert" }
    } >
        {
            children
        }
    </div>
    );

}

export { Openable };