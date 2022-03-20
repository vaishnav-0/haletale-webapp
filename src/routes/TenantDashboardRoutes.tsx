import {
    Routes,
    Route,
} from "react-router-dom";
import CenterContent from "../components/CenterContent";
import Dashboard, { dashboardItems } from "../pages/Tenant/Dashboard/TenantDashboard";

export default function TenantDashboardRoutes() {

    return (
        <Routes>
            <Route path="*" element={<Dashboard />}>
                <Route index element={<CenterContent>DASHBOARD</CenterContent>} />
                {
                    dashboardItems.map(e => <Route path={e.url} element={e.component} />)
                }
                {
                    dashboardItems.map(e => <Route path={e.url} element={e.component} />)
                }
            </Route>
        </Routes>

    )
}