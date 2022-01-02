import React from "react";
import { clickOutsideEvent } from '../functions/domEvents';
import { expand, collapse, zoomIn, zoomOut } from '../functions/animations';
import styleSheet from './Openable.module.scss';

type animation = {
    type: "slide" | "zoom";
    duration?: string,
    timing?: string;
} | undefined

function handleOpen(state: boolean, ref: React.MutableRefObject<HTMLElement>, animation: animation, animate: boolean = true) {
    if (!animation)
        return ref.current.style.display = !state ? "none" : "";
    const { type, ...config } = animation;
    if (type === "slide")
        state ? expand(ref, config, true, !animate) : collapse(ref, config, true, !animate);
    else if (type === "zoom")
        state ? zoomIn(ref, config, !animate) : zoomOut(ref, config, !animate);
}
interface OpenableProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children?: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,
    open: [boolean, (a: boolean) => void],
    closeOnClickOutside?: boolean,
    clickOutsideCloseException?: React.MutableRefObject<HTMLElement>[],
    animation?: animation,

}

const Openable = function ({ children, className, style, open, clickOutsideCloseException,
    closeOnClickOutside = true, animation, ...rest }: OpenableProps): JSX.Element {
    const ref = React.useRef<HTMLDivElement>(null!);
    const firstRender = React.useRef(true);
    React.useEffect(() => {
        if (closeOnClickOutside)
            return clickOutsideEvent(ref, () => open[1](false), clickOutsideCloseException);
    }, []);
    React.useEffect(() => {
        if (firstRender.current && !open[0]) {
            handleOpen(open[0], ref, animation, false);
        } else
            handleOpen(open[0], ref, animation);
        firstRender.current = false;
    }, [open]);
    return (
        <>
            < div
                ref={ref}
                className={`${className}`}
                style={{ ...style, ...firstRender.current && !open[0] ? { display: "none" } : {} }}
                {...rest}
            >
                {
                    children
                }
            </div >
        </>

    );

}

export { Openable };