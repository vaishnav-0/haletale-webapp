import React from "react";
import { Link } from "react-router-dom";
import style from './SidebarNavigation.module.scss';
export default function SidebarNavigation({ items, children }: { items: { label: string, url: string }[], children: JSX.Element }) {
    const [active, setActive] = React.useState<number>(-1);
    return (
        <div className={style["sidenav-container"]}>
            <div className={style["nav-container"]}>
                <ul className={style["nav-list"]}>
                    {
                        items.map((e, i) => <li>
                            <Link onClick={() => setActive(i)} className={active === i ? style["active"] : ""}
                                to={e.url}>{e.label}
                            </Link>
                        </li>
                        )
                    }
                </ul>
            </div>
            <div className={style["content"]}>
                {
                    children
                }
            </div>
        </div>

    )
}