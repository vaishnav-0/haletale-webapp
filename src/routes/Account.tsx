import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Outlet } from "react-router-dom";
import SidebarNavigation from "../components/SidebarNavigation";
import Account, { accountItems, otherRoutes } from "../pages/Account/Account";
export default function AccountRoutes() {

    return (
        <Routes>
            <Route path="*" element={<Account />}>
                {
                    accountItems.map((e, i) => <Route path={e.url} key={i} element={e.component} />)
                }
                {
                    otherRoutes.map((e, i) => <Route path={e.url} key={i} element={e.component} />)
                }
            </Route>
        </Routes>

    )
}