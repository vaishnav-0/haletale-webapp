
import React from "react";
import SidebarNavigation from "../../components/SidebarNavigation";
import {
    Outlet, useLocation
} from "react-router-dom";
import Users from "./subpages/dashboard/Users";
import Properties from "./subpages/dashboard/Properties";
import Requests from "./subpages/dashboard/Requests";

export const dashboardItems = [
    { label: "Users", url: "users", component: <Users /> },
    { label: "Properties", url: "properties", component: <Properties /> },
    { label: "Tenant requests", url: "tenant-requests", component: <Requests /> },
]

export default function Dashboard() {
    const location = useLocation();
    const [activePath, setActivePath] = React.useState<number | undefined>();
    React.useEffect(() => {
        const paths = location.pathname.split("/");
        dashboardItems.forEach((e, i) => {
            if (e.url === paths[paths.length - 1])
                setActivePath(i);
        })
    }, [location]);
    return (
        <SidebarNavigation items={dashboardItems} active={activePath}>
            <Outlet />
        </SidebarNavigation>
    )
}