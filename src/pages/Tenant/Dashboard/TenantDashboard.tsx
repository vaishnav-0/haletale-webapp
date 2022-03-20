import React from "react";
import SidebarNavigation from "../../../components/SidebarNavigation";
import {
    Outlet, useLocation
} from "react-router-dom";
import Layout from "../../Layout";
import TenantRequestView from "./TenantRequestView";

export const dashboardItems = [
    { label: "Requests", url: "request", component: <TenantRequestView /> },
    { label: "Bookings", url: "bookings", component: <></> },
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
        <Layout>
            <SidebarNavigation items={dashboardItems} active={activePath}>
                <Outlet />
            </SidebarNavigation>
        </Layout>
    )
}