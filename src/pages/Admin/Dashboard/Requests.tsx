
import React from 'react';
import style from './styles.module.scss';
import { gql, useMutation, useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom';
import { useLoader } from '../../../components/Loader';
import requestsQuery, { IRequestData } from '../../../queries/requests.query';
import requestMutation from '../../../queries/request.mutation';
import Table from '../../../components/Table';
import { objectStringifiedAccessor } from '../../../functions/utils';
import { usePopupDialog } from '../../../components/PopupDialog';
import ClampLines from 'react-clamp-lines';
import { ButtonHollow, ButtonSolid } from '../../../components/Button';
import { TextArea } from '../../../components/Form/components/TextArea';

const StatusEditor = (props: { submit: (v: string) => void, close: () => void, defaultValue?: string }) => {
    const statusRef = React.useRef<string>(props.defaultValue ?? "")
    return < div style={{ display: "flex", flexDirection: "column", gap: "0.5em" }
    }>
        Status:
        <TextArea onChange={e => statusRef.current = e.target.value} name='status-edit' rows={5} cols={40} defaultValue={props.defaultValue} />
        <ButtonSolid style={{padding:"0.5em"}} onClick={() => {
            props.submit(statusRef.current);
            props.close();
        }}>Edit</ButtonSolid>
    </div >
}
export default function Properties() {
    const navigate = useNavigate();
    const [Popup, setPopup] = usePopupDialog({ buttonsVisible: false });
    const { data: allRequestData, loading: allRequestDataLoading, refetch } = useQuery<IRequestData>(requestsQuery.ADMIN_GET_ALL_REQUESTS, {
        fetchPolicy: "network-only"
    });
    const [deleteRequests, { data: requestsDeleteData, loading: requestsDeleteLoading, }] = useMutation(requestMutation.DELETE_REQUEST, { onCompleted: refetch });
    React.useEffect(() => {
        if (allRequestDataLoading)
            setLoader(true)
        else
            setLoader(false)
    }, [allRequestDataLoading])
    const [Loader, setLoader] = useLoader({});
    const [setApprovedMutation, { data: setApprovedMutationData, loading: setApprovedutationLoading }] = useMutation(requestMutation.APPROVE_REQUESTS, { onCompleted: refetch })
    const [updateStatusMutation, { data: updateStatusMutationData, loading: updateStatusMutationLoading }] = useMutation(requestMutation.UPDATE_STATUS, { onCompleted: refetch })
    const onSortChange = (sortInput: any) => {
        refetch({
            order_by: objectStringifiedAccessor({}, sortInput.sortBy, sortInput.sortType)
        });
    }
    const result = React.useMemo(() => allRequestData?.property_request ?? [], [allRequestData])
    // table structure
    const columns = React.useMemo<{ Header: string, accessor: string | undefined | ((d: any) => string | number | undefined | JSX.Element) }[]>(
        () => [
            {
                Header: "Property id",
                accessor: (data) => <button title={data.property_id} style={{ width: "100px" }} className={style["link-btn"]} onClick={() => navigate("/property/view?id=" + data.property_id)}>{data.property_id}</button>,
            },
            {
                Header: 'Name',
                accessor: 'user.name',
            },
            {
                Header: 'Phone',
                accessor: 'user.phone',
            },
            {
                Header: 'Email',
                accessor: 'user.email',
            },
            {
                Header: 'Reachout time',
                accessor: 'reachout_time'
            },
            {
                Header: 'Lease duration',
                accessor: 'lease_duration',
            },
            {
                Header: 'Other tenants',
                accessor: (data) => data.other_tenents?.map((t: any) => {
                    return <div style={{ border: "1px solid black" }}>{Object.entries(t).map(([k, v]) => k + ":" + v).join(' ')}</div>
                })
            },
            {
                Header: 'Intented move in',
                accessor: 'intended_move_in_date',
            },
            {
                Header: 'Status',
                accessor: (data) => <div style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
                    <ClampLines text={data.status ?? ""} id={data.id + "-status"} />
                    <ButtonHollow
                        onClick={() => setPopup(
                            true,
                            (_, __, close) => (
                                <StatusEditor
                                    close={close}
                                    submit={(v) => {
                                        updateStatusMutation({ variables: { id: data.id, status: v } })
                                    }}
                                    key={Date.now() + "SEdit"}
                                    defaultValue={data.status}
                                />
                            ),
                        )}>
                        Edit
                    </ButtonHollow>
                </div>,
            },
            {
                Header: 'Push to landlord',
                accessor: (data) => <button onClick={() => setApprovedMutation({ variables: { ids: [data.id], isApproved: !data.isApproved } })} className={`${style["property-approve-btn"]} ${data.isApproved ? style["disapprove"] : ""}`}>{data.isApproved ? "Remove approval" : "Approve"}</button>,
            },

        ],
        []
    )


    // chng page

    return <>
        {Loader}
        {Popup}
        <div>
            <Table
                columns={columns}
                data={result}
                sortData={
                    {
                        fields:
                            { "user.name": "Name", "user.email": "Email", "reachout_time": "Reachout time", "intended_move_in_date": "Move in date", "lease_duration": "Lease duration", "isApproved": "Status" },
                        onChange: onSortChange
                    }
                }
                actions={
                    {
                        "Delete": (data: any) => setPopup(true, "This will delete the selected requests. Are you sure?", () => deleteRequests({ variables: { ids: data.map((e: any) => e.id) } })),
                        "Approve": (data: any) => setPopup(true, "This will approve the selected requests. Are you sure?", () => setApprovedMutation({ variables: { ids: data.map((e: any) => e.id), isApproved: true } })),
                        "Remove Approval": (data: any) => setPopup(true, "This remove approval for the selected requests. Are you sure?", () => setApprovedMutation({ variables: { ids: data.map((e: any) => e.id), isApproved: false } })),
                    }
                }
            />
        </div>
    </>
}


