import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Outlet } from "react-router-dom";
import SidebarNavigation from "../components/SidebarNavigation";
const items = [
    { label: "Basic details", url: "basics", component: <div>1</div> },
    { label: "something", url: "something", component: <div>2</div> }
]
function Account() {
    return (
        <SidebarNavigation items={items} >
            <Outlet />
        </SidebarNavigation>
    )
}

export default function () {

    return (
        <Routes>
            <Route path="*" element={<Account />}>
                {
                    items.map(e => <Route path={e.url} element={e.component} />)
                }
            </Route>
        </Routes>

    )
}