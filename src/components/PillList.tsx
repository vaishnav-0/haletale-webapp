import React from 'react';
import style from './PillList.module.scss';
type props = {
    items: string[];
}
export function PillList({ items }: props): JSX.Element {
    const [activePills, setActivePills] = React.useState<number[]>([]);
    if (!Array.isArray(items))
        return <></>;
    else
        return (
            <div className={style["pill-list"]}>
                {items.map((e, i) =>
                    <div className={`${style["pill"]} ${activePills.includes(i) ? style["pill-active"] : ""}`}
                        onClick={() => {
                            let p = activePills.indexOf(i);
                            if (p == -1) {
                                setActivePills([...activePills, i]);
                            }
                            else {
                                let n = [...activePills];
                                n.splice(p, 1);
                                setActivePills(n);
                            }

                        }}
                    >
                        {e}
                    </div>
                )}
            </div>
        );
}