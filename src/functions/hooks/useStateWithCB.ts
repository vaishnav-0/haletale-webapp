import React from 'react';
export default function <T>(d: T): [T, (v: T, cb?: (v: T) => void) => void] {
    const [state, updateState] = React.useState<T>(d);
    const callback = React.useRef<(v: T) => void>(() => { });
    const update = (val: T, cb?: (v: T) => void) => {
        let v = (typeof val === 'function') ? val(state) : val;
        cb && (callback.current = cb);
        updateState(val)
    }
    React.useEffect(() => {
        if (typeof callback.current === 'function')
            callback.current(state);
    }, [state]);
    return [state, update]
}