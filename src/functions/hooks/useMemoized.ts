/*
https://reactjs.org/docs/hooks-reference.html
You may rely on useMemo as a performance optimization, not as a semantic guarantee. 
In the future, React may choose to “forget” some previously memoized values and recalculate them on next render, 
e.g. to free memory for offscreen components. Write your code so that it still works without useMemo — and then 
add it to optimize performance.
*/
import React from "react";

export function useMemoized<T>(fn: () => T, deps: any[]) {
    const memoizedValue = React.useRef(fn());
    const prevDep = React.useRef<any[] | null>(null);
    const didDepsChange = (prev: any[] | null, curr: any[]) => {
        return !!prev && (prev.length !== curr.length || curr.some((e, i) => !Object.is(e, prev[i])))
    }
    if (didDepsChange(prevDep.current, deps)) {
        memoizedValue.current = fn();
    }
    prevDep.current = deps;
    return memoizedValue.current;
}