import React from 'react';
import { number } from 'yup';
import style from './PillList.module.scss';

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
    maxActive?: number
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

export function PillList({ items, onChange, disabledKeys = [], disabled,
    maxActive, disabledActivatableKeys = [], defaultValues = [], onClick = () => { } }: PropsType): JSX.Element {
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
            return Array.from({ length: Object.keys(items).length }, (_, i) => i + 1)
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
        <div className={style["pill-list"]}>
            {Object.entries(items_).map(([k, e], i) =>
                <div key={i}
                    className={`${style["pill"]} ${disabledKeys_.includes(i) ?
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
interface usePillCollectionProps {
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
    onChange?: (v: any) => void,
}
type LimitType = { [k: string]: number };
const Wrapper = function (props: Omit<PropsType, "items"> & { children: (a: any) => JSX.Element }) {
    return props.children(props)
}
export function usePillCollection({ items }: usePillCollectionProps) {
    const listLimits: LimitType = {};
    const [listRemaining, setListRemaining] = React.useState<LimitType>({});
    const listRemaining_ = React.useRef(listRemaining)
    const [groupRemaining, setgroupRemaining] = React.useState<LimitType>({});
    const groupRemaining_ = React.useRef(listRemaining)
    const [disabledItems, setDisabledItems] = React.useState<string[]>([]);
    const pillListItems: ItemType = React.useMemo(() => {
        if (items.single) {
            return (items.single)?.reduce((obj, curr) => {
                curr.limit && (listLimits[curr.name] = curr.limit)
                return Object.assign(obj, { [curr.name]: curr.value ?? curr.name });
            }, {});
        }
        return {};
    }, [items]);
    const disabledItems_ = React.useRef(disabledItems);
    const updateListComponentFns = React.useRef<React.Dispatch<React.SetStateAction<boolean>>[]>([]);
    const addListUpdateFn = (fn: React.Dispatch<React.SetStateAction<boolean>>) => {
        updateListComponentFns.current.push(fn);
    }
    const updateListComponent = () => {
        updateListComponentFns.current.forEach(e => e(p => !p));
    }
    React.useEffect(() => {
        setListRemaining(listLimits);
    }, []);
    React.useEffect(() => {
        console.log(disabledItems);
        disabledItems_.current = disabledItems;
        updateListComponent();
    }, [disabledItems]);
    React.useEffect(() => {
        console.log(listRemaining)
        listRemaining_.current = listRemaining;
        setDisabledItems(Object.entries(listRemaining).filter((e) => e[1] === 0).map(e => e[0]))
    }, [listRemaining]);
    console.log(listRemaining);
    const onClick_ = (k: string, clickType: boolean) => {
        if (listRemaining_.current[k] !== undefined) {
            setListRemaining(p => { return { ...p, [k]: p[k] - (clickType ? 1 : -1) } });
        }
    }
    return {
        Collection: React.useMemo(() => function A({ children, ...props }: { children: ({ List, Groups }: { List?: JSX.Element, Groups?: JSX.Element[] }) => JSX.Element } & Omit<PropsType, "items">) {
            const [, updateList] = React.useState<boolean>(false);
            React.useEffect(() => {
                addListUpdateFn(updateList);
            }, []);
            return children({
                List: < PillList items={pillListItems}
                    onClick={(k, t) => {
                        onClick_(k, t);
                        props.onClick && props.onClick(k, t)
                    }}
                    disabledActivatableKeys={disabledItems_.current}
                />
            }
            )
        }, [])
    }
}