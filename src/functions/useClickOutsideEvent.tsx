import React from "react";

export function useClickOutsideEvent(ref: { current: HTMLElement }, onClick: () => void = () => { }): void {
    const handleClickOutside = (event: Event) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            onClick();
        }
    };
    React.useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);
}