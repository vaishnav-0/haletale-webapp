import React from "react";
type ret = {
    setExcludedFromClick: (elements: HTMLElement[]) => void
}

export function useClickOutsideEvent(
    ref: { current: HTMLElement },
    onClick: () => void = () => { },
    exclude?: HTMLElement[])
    : ret {
    const excluded = React.useRef<HTMLElement[]>([]);
    if (exclude)
        excluded.current = exclude;
    const handleClickOutside = (event: Event) => {
        for (let i = 0; i < excluded.current.length; i++) {
            if (excluded.current[i]?.contains(event.target as Node))
                return;
        }
        if (ref.current && !ref.current.contains(event.target as Node)) {
            onClick();
        }

    }
    React.useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);
    return { setExcludedFromClick: (elements) => { excluded.current = elements } };

}