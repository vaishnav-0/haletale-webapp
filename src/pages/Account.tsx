import React from "react";
import SidebarNavigation from "../components/SidebarNavigation";
import {
    Outlet, useLocation
} from "react-router-dom";
import { BasicDetails } from "./subpages/account/BasicDetails";
export const accountItems = [
    { label: "Basic details", url: "basics", component: <BasicDetails key={"display"} edit={false} /> },
    { label: "Documents", url: "docs", component: <div></div> }
]
export const otherRoutes = [
    { url: "basics/edit", component: <BasicDetails key={"edit"} edit /> },
]

export default function Account() {
    const location = useLocation();
    const [activePath, setActivePath] = React.useState<number | undefined>();
    React.useEffect(() => {
        const paths = location.pathname.split("/");
        accountItems.forEach((e, i) => {
            if (e.url === paths[paths.length - 1])
                setActivePath(i);
        })
    }, [location]);
    return (
        <SidebarNavigation items={accountItems} active={activePath}>
            <Outlet />
        </SidebarNavigation>
    )
}