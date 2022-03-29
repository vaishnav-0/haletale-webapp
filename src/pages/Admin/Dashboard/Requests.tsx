
import React from 'react';
import style from './styles.module.scss';
import { gql, useMutation, useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom';
import { useLoader } from '../../../components/Loader';
import requestsQuery, { IRequestData } from '../../../queries/requests.query';
import requestMutation from '../../../queries/request.mutation';
import Table from '../../../components/Table';

export default function Properties() {
    const navigate = useNavigate();
    const { data: allRequestData, loading: allRequestDataLoading, refetch } = useQuery<IRequestData>(requestsQuery.ADMIN_GET_ALL_REQUESTS, {
        fetchPolicy: "network-only"
    });
    React.useEffect(() => {
        if (allRequestDataLoading)
            setLoader(true)
        else
            setLoader(false)
    }, [allRequestDataLoading])
    const [Loader, setLoader] = useLoader({});
    const [setApprovedMutation, { data: setApprovedMutationData, loading: setApprovedutationLoading }] = useMutation(requestMutation.APPROVE_REQUEST, { onCompleted: refetch })

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
                Header: 'Push to landlord',
                accessor: (data) => <button disabled={setApprovedutationLoading} onClick={() => setApprovedMutation({ variables: { id: data.id, isApproved: !data.isApproved } })} className={`${style["property-approve-btn"]} ${data.isApproved ? style["disapprove"] : ""}`}>{data.isApproved ? "Remove approval" : "Approve"}</button>,
            },

        ],
        []
    )


    // chng page

    return <>
        {Loader}
        <div>
            <Table columns={columns} data={result} />
        </div>
    </>
}


