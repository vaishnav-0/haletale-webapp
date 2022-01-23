import React from 'react';
import style from './PillList.module.scss';
export type PropsType = {
    items: { [k: string]: string };
    onChange?: (v: any) => void,
    onBlur?: () => void
}
export function PillList({ items, onChange }: PropsType): JSX.Element {
    const [activePills, setActivePills] = React.useState<number[]>([]);
    const setValue = (v: number[]) => {
        setActivePills(v);
        onChange && onChange(Object.keys(items).filter((e, i) => v.includes(i)));
    }
    return (
        <div className={style["pill-list"]}>
            {Object.values(items).map((e, i) =>
                <div key={i} className={`${style["pill"]} ${activePills.includes(i) ? style["pill-active"] : ""}`}
                    onClick={() => {
                        let p = activePills.indexOf(i);
                        if (p == -1) {
                            setValue([...activePills, i]);
                        }
                        else {
                            let n = [...activePills];
                            n.splice(p, 1);
                            setValue(n);
                        }

                    }}
                >
                    {e}
                </div>
            )}
        </div>
    );
}