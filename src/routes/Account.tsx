import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Outlet } from "react-router-dom";
import SidebarNavigation from "../components/SidebarNavigation";
import Account, { accountItems, otherRoutes } from "../pages/Account";
export default function AccountRoutes() {

    return (
        <Routes>
            <Route path="*" element={<Account />}>
                {
                    accountItems.map(e => <Route path={e.url} element={e.component} />)
                }
                {
                    otherRoutes.map(e => <Route path={e.url} element={e.component} />)
                }
            </Route>
        </Routes>

    )
}