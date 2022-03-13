import { useNavigate } from "react-router-dom";
import { IRequestData } from '../queries/requests.query';
import style from './RequestCard.module.scss';

export default function RequestCard({ requestData }: { requestData: IRequestData["property_request"][number] }) {
    const navigate = useNavigate();
    return (
        <div className={style["request-card"]}>
            {
                requestData.property_id &&
                <div className={style["request-card-property"]}>
                    <span className={style["title"]}>Property: </span>
                    <button
                        className={style["btn-link"]}
                        onClick={() => navigate("/property/view?id=" + requestData.property_id)} > {requestData.property_id}</button>
                </div>
            }
            <div><span className={style["title"]}>Name: </span>{requestData.user.name}</div>
            <div><span className={style["title"]}>Email: </span>{requestData.user.email}</div>
            <div><span className={style["title"]}>Phone: </span>{requestData.user.phone}</div>
            <div><span className={style["title"]}>Intended move in date: </span>{requestData.intended_move_in_date}</div>
            <div><span className={style["title"]}>Lease duration: </span> {requestData.lease_duration}</div>
            <div className={style["othertenants"]}>
                <div className={style["title"]}>Other tenants: </div>
                {
                    requestData.other_tenents?.map(e => <div>{e.name}</div>)
                }
            </div>
        </div>
    )
}