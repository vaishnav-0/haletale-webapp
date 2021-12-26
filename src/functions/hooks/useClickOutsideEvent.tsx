import React from "react";

export function useClickOutsideEvent<T extends Node>(ref: { current: HTMLElement }, onClick: () => void = () => { }, exclude?: React.MutableRefObject<T>[]): void {
    const handleClickOutside = (event: Event) => {
        if (exclude)
            for (let i = 0; i < exclude.length; i++) {
                if (exclude[i].current.contains(event.target as Node))
                    return;
            }
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