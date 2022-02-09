import React from 'react';
import { number, string } from 'yup';
import style from './PillList.module.scss';
import { useMemoized } from '../../../functions/hooks/useMemoized'

type ItemType = { [k: string]: string } | string[];
export type PropsType = {
    items: ItemType,
    onChange?: (v: any) => void,
    onBlur?: () => void,
    onClick?: (key: string, isActivationClick: boolean) => void
    disabledKeys?: (number | string)[],
    disabledActivatableKeys?: (number | string)[],
    defaultValues?: (number | string)[],
    disabled?: boolean,
    maxActive?: number,
    className?: string,
    key?:React.Attributes["key"]
}
function getKeyPosition(obj: object, key: string) {
    return Object.keys(obj).indexOf(key);
}

function keyArrayToPositionArray(keyArray: Array<number | string>, obj: object) {
    return keyArray.reduce((arr: number[], curr) => {
        let pos = typeof curr === 'string' ? getKeyPosition(obj, curr) : curr;
        return pos !== -1 ? [...arr, pos] : arr;
    }, []);
}

export function PillList({ items, onChange, disabledKeys = [], disabled, className: pillClassname = "",
    maxActive, disabledActivatableKeys = [], defaultValues = [], onClick = () => { },key }: PropsType): JSX.Element {
    const defaultValues_ = React.useMemo(() => {
        if (defaultValues.length > 0) {
            return keyArrayToPositionArray(defaultValues, items);
        }
        return defaultValues as number[];
    }, [defaultValues])
    const disabledActivatableKeys_ = React.useMemo(() => {
        if (disabledActivatableKeys.length > 0) {
            return keyArrayToPositionArray(disabledActivatableKeys, items);
        }
        return disabledActivatableKeys as number[];
    }, [defaultValues])
    const items_ = React.useMemo(() => {
        if (Array.isArray(items)) {
            return items.reduce((obj, e) => {
                return Object.assign(obj, { [e]: e });
            }, {})
        }
        return items;
    }, [items])
    const disabledKeys_ = React.useMemo(() => {
        if (disabled)
            return Object.keys(items).map((_, i) => i);
        if (disabledKeys.length > 0) {
            return keyArrayToPositionArray(disabledKeys, items);
        }
        return disabledKeys as number[];
    }, [disabledKeys, disabled])
    const [activePills, setActivePills] = React.useState<number[]>(defaultValues_);
    const setValue = (v: number[]) => {
        setActivePills(v);
        onChange && onChange(Object.keys(items_).filter((e, i) => v.includes(i)));
    }
    return (
        <div key={key} className={style["pill-list"]}>
            {Object.entries(items_).map(([k, e], i) =>
                <div key={i}
                    className={`${pillClassname} ${style["pill"]} ${disabledKeys_.includes(i) ?
                        style["pill-inactive"] : ""} ${activePills.includes(i) ?
                            style["pill-active"] : disabledActivatableKeys_.includes(i) ? style["pill-inactive"] : ""}`}
                    onClick={() => {
                        if (!disabledKeys_.includes(i)) {
                            let p = activePills.indexOf(i);
                            if (p == -1) {
                                if (disabledActivatableKeys_.includes(i))
                                    return
                                let n = [...activePills];
                                if (maxActive === activePills.length) {
                                    n.pop();
                                }
                                setValue([...n, i]);
                                onClick(k, true);
                            }
                            else {
                                let n = [...activePills];
                                n.splice(p, 1);
                                setValue(n);
                                onClick(k, false);
                            }
                        }
                    }}
                >
                    {e}
                </div>
            )}
        </div>
    );
}
export function PillGroup(props: Omit<PropsType, "maxActive">): JSX.Element {

    return (
        <PillList {...props}
            maxActive={1} />
    );
}
export interface usePillCollectionProps {
    items: {
        single?: {
            name: string,
            value?: string,
            limit?: number
        }[],
        group?: {
            name: string,
            items: ItemType,
            limit?: number
        }[]
    },
    pillProps?: Omit<PropsType, "items" | "onClick">;
}
type GroupType = { [k: string]: React.FC<Omit<PropsType, "items">> }
type CollectionChildrenFnType = ({ List, Groups }:
    { List: React.FC<Omit<PropsType, "items">>, Groups: GroupType }
) => JSX.Element;
type LimitType = { [k: string]: number };

export function usePillCollection({ items, pillProps = {} }: usePillCollectionProps) {
    const value = React.useRef<string[]>([]);
    const listRemaining = React.useRef<LimitType>({});
    const disabledItems = React.useRef<string[]>([]);
    const groupsRemaining = React.useRef<LimitType>({});
    const disabledGroups = React.useRef<string[]>([]);
    const pillListItems: ItemType = React.useMemo(() => {
        if (items.single) {
            return (items.single).reduce((obj, curr) => {
                curr.limit && (listRemaining.current[curr.name] = curr.limit)
                return Object.assign(obj, { [curr.name]: curr.value ?? curr.name });
            }, {});
        }
        return {};
    }, [items]);
    React.useEffect(() => {
        if (items.group) {
            groupsRemaining.current =
                Object.fromEntries(items.group.filter(e => !!e.limit).map(e => [e.name, e.limit as number]));
        }
    }, []);
    //Fns to update List Component
    const updateListComponentFns = React.useRef<React.Dispatch<React.SetStateAction<boolean>>[]>([]);
    const addListUpdateFn = (fn: React.Dispatch<React.SetStateAction<boolean>>) => {
        updateListComponentFns.current.push(fn);
    }
    const updateListComponent = () => {
        updateListComponentFns.current.forEach(e => e(p => !p));
    }
    //Fns to update group Component
    const updateGroupComponentFns = React.useRef<{ [k: string]: React.Dispatch<React.SetStateAction<boolean>>[] }>({});
    const addGroupUpdateFn = (fn: React.Dispatch<React.SetStateAction<boolean>>, k: string) => {
        updateGroupComponentFns.current[k] = updateGroupComponentFns.current[k] ? [...updateGroupComponentFns.current[k], fn] : [fn];
    }
    const updateGroupComponent = (k: string) => {
        updateGroupComponentFns.current[k]?.forEach(e => e(p => !p));
    }
    const onClickGen = (type: "list" | "group") => {
        const isList = type === "list";
        const remainingItems = isList ? listRemaining : groupsRemaining;
        const disabled = isList ? disabledItems : disabledGroups;
        const updateFn = isList ? (k: string) => updateListComponent() : updateGroupComponent;
        return (k: string, clickType: boolean) => {
            if (remainingItems.current[k] !== undefined) {
                let foundIndex = disabled.current.indexOf(k);
                if (!(remainingItems.current[k] - (clickType ? 1 : -1)) === !(foundIndex + 1)) {
                    let ret = [...disabled.current];
                    clickType ? ret.push(k) :
                        ret.splice(foundIndex, 1);
                    disabled.current = ret;
                    updateFn(k);
                }
                remainingItems.current = { ...remainingItems.current, [k]: remainingItems.current[k] - (clickType ? 1 : -1) };
            };
        }
    }
    const listOnClick = onClickGen("list");
    const groupOnClick = onClickGen("group");
    const List = useMemoized(() => function P_List({ onClick, ...props }: Omit<PropsType, "items" | "disabledActivatableKeys">) {
        const [, updateList] = React.useState<boolean>(false);
        React.useEffect(() => {
            addListUpdateFn(updateList);
        }, []);

        return < PillList items={pillListItems}
            onClick={(k, t) => {
                listOnClick(k, t);
                onClick && onClick(k, t)
            }}
            disabledActivatableKeys={disabledItems.current}
            {...{ ...props, ...pillProps }}
        />
    }, []);
    const Groups: GroupType = useMemoized(() => {
        return !items.group ?
            {} :
            items.group.reduce((obj, e) =>
                Object.assign(obj, {
                    [e.name]:
                        function P_Group({ onClick, ...props }: Omit<PropsType, "items" | "disabledActivatableKeys">) {
                            const [, updateList] = React.useState<boolean>(false);
                            const indices = Object.keys(e.items).map((_, i) => i);
                            React.useEffect(() => {
                                addGroupUpdateFn(updateList, e.name);
                            }, []);

                            return < PillGroup items={e.items}
                                onClick={(k, t) => {
                                    groupOnClick(e.name, t);
                                    onClick && onClick(k, t)
                                }}
                                disabledActivatableKeys={disabledGroups.current.includes(e.name) ? indices : []}
                                {...{ ...props, ...pillProps }}
                            />
                        }
                }), {})
    }, [])
    return { List: List, Groups: Groups };
}

export function PillCollection({ items, children = null }: usePillCollectionProps & { children?: CollectionChildrenFnType | never[] | null }
) {
    const C = usePillCollection({ items: items });
    return children && (children as CollectionChildrenFnType)(C);
}