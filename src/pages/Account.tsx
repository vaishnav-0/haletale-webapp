import SidebarNavigation from "../components/SidebarNavigation";
import {
    Outlet
} from "react-router-dom";
import { BasicDetails } from "./subpages/account/BasicDetails";
export const accountItems = [
    { label: "Basic details", url: "basics", component: <BasicDetails /> },
    { label: "something", url: "something", component: <div>2</div> }
]


export default function Account() {
    return (
        <SidebarNavigation items={accountItems} >
            <Outlet />
        </SidebarNavigation>
    )
}