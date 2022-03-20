import { useQuery } from "@apollo/client";
import requestsQuery, { IRequestData } from "../../../queries/requests.query";
import RequestCard from "../../../components/RequestCard";
import landLordDashboardStyle from '../../Landlord/LandlordDashboard.module.scss';
import CenterContent from "../../../components/CenterContent";

export default function () {
    const { data: requestData, loading, fetchMore } = useQuery<IRequestData>(requestsQuery.GET_REQUESTED_PROPERTIES);
    return <>
        <div className={landLordDashboardStyle["viewrequest-heading"]}>
            My bookings:
        </div>
        {
            requestData?.property_request.length === 0 ?
                <CenterContent>
                    No requests
                </CenterContent>
                :
                null
        }
        <div className={landLordDashboardStyle["viewrequest-wrapper"]}>
            {
                requestData?.property_request.map(request => <RequestCard requestData={request} />)
            }
        </div>
    </>
}