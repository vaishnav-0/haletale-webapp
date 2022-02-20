import React from "react";

export type useListStateReturnType<T> = {
    list: any[],
    add: (item: T, pos?: number) => void,
    remove: (pos?: number) => void,
    replace: (a: T | [T, number][], pos?: number) => void
}
export default function useListState<T>(defaultValue: T[] = []): useListStateReturnType<T> {
    const [list, updateList] = React.useState(defaultValue);
    const add: useListStateReturnType<T>['add'] = React.useCallback(
        (item, pos) => {
            if (pos && pos < 0)
                throw new Error("position shouldn't be negative");
            updateList(l => {
                pos = pos ?? l.length;
                let list_ = [...l];
                list_.splice(pos, 0, item);
                return list_;
            });
        },
        []
    );
    const remove: useListStateReturnType<T>['remove'] = React.useCallback(
        (pos) => {
            if (pos && pos < 0)
                throw new Error("position shouldn't be negative");
            updateList(l => {
                pos = pos ?? l.length - 1;
                let list_ = [...l];
                console.log(pos)
                list_.splice(pos, 1);
                return list_;
            });
        },
        []
    );
    const replace: useListStateReturnType<T>['replace'] = React.useCallback(
        (a, pos) => {
            if (Array.isArray(a)) {
                updateList(l => {
                    let list_ = [...l];
                    a.forEach((e) => {
                        if (e[1] < 0)
                            throw new Error("position shouldn't be negative");
                        list_.splice(e[1], 1, e[0]);
                    })
                    return list_;
                });

            } else {
                if (!pos || pos < 0)
                    throw new Error("position shouldn't be negative");
                else
                    updateList(l => {
                        let list_ = [...l];
                        list_.splice(pos, 1, a);
                        return list_;
                    });
            }

        },
        []
    );
    return { list, add, remove, replace };
}