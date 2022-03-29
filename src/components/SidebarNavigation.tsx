import React from "react";
import { Link } from "react-router-dom";
import style from './SidebarNavigation.module.scss';
import Layout from "../pages/Layout";
export default function SidebarNavigation({ items, active, children }: { items: { label: string, url: string }[], children: JSX.Element, active?: number }) {
    return (
        <div className={style["sidenav-container"]}>
            <div className={style["nav-container"]}>
                <ul className={style["nav-list"]}>
                    {
                        items.map((e, i) => <li key={i}>
                            <Link className={active === i ? style["active"] : ""}
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