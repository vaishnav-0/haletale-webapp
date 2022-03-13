import React from 'react';
export default function <T>(d: T): [T, (v: React.SetStateAction<T>, cb?: (v: T) => void) => void] {
    const [state, updateState] = React.useState<T>(d);
    const callback = React.useRef<(v: T) => void>(() => { });
    const update = (val: React.SetStateAction<T>, cb?: (v: T) => void) => {
        cb && (callback.current = cb);
        updateState(val);
    }
    React.useEffect(() => {
        if (typeof callback.current === 'function')
            callback.current(state);
    }, [state]);
    return [state, update]
}