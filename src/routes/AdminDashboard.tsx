import {
    Routes,
    Route,
} from "react-router-dom";
import CenterContent from "../components/CenterContent";
import Dashboard, { dashboardItems } from "../pages/Admin/Dashboard/Dashboard";

export default function AdminDashboardRoutes() {

    return (
        <Routes>
            <Route path="*" element={<Dashboard />}>
                <Route index element={<CenterContent>DASHBOARD</CenterContent>} />
                {
                    dashboardItems.map((e, i) => <Route key={i} path={e.url} element={e.component} />)
                }
                {
                    dashboardItems.map((e, i) => <Route key={i} path={e.url} element={e.component} />)
                }
            </Route>
        </Routes>

    )
}