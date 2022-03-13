import { useQuery } from "@apollo/client";
import requestsQuery, { IRequestData } from "../queries/requests.query";
import Layout from "./Layout";
import RequestCard from "../components/RequestCard";
import landLordDashboardStyle from './LandlordDashboard.module.scss';

export default function () {
    const { data: requestData, loading, fetchMore } = useQuery<IRequestData>(requestsQuery.GET_REQUESTED_PROPERTIES);
    return <Layout>
        <div className={landLordDashboardStyle["viewrequest-heading"]}>
            My bookings:
        </div>
        <div className={landLordDashboardStyle["viewrequest-wrapper"]}>
            {
                requestData?.property_request.map(request => <RequestCard requestData={request} />)
            }
        </div>
    </Layout>
}