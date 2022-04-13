

import React from 'react';
import style from './styles.module.scss';
import { gql, useMutation, useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom';
import { useLoader } from '../../../components/Loader';
import userQuery, { IUserData } from '../../../queries/user.query';
import { userMutation } from '../../../queries';
import Table from '../../../components/Table';
import { objectStringifiedAccessor } from '../../../functions/utils';

export default function Properties() {
    const navigate = useNavigate();
    const { data: allUserData, loading: allUserDataLoading, refetch } = useQuery<IUserData>(userQuery.ADMIN_GET_ALL_USERS, {
        fetchPolicy: "network-only"
    });
    React.useEffect(() => {
        if (allUserDataLoading)
            setLoader(true)
        else
            setLoader(false)
    }, [allUserDataLoading])
    const [Loader, setLoader] = useLoader({});
    const [setApprovedMutation, { data: setApprovedMutationData, loading: setApprovedMutationLoading }] = useMutation(userMutation.SET_USER_STATUS, { onCompleted: refetch, notifyOnNetworkStatusChange: true })

    const result = React.useMemo(() => allUserData?.user ?? [], [allUserData])
    const onSortChange = (sortInput: any) => {
        refetch({
            order_by: objectStringifiedAccessor({}, sortInput.sortBy, sortInput.sortType)
        });
    }
    // table structureexport interface IUserData {
    const columns = React.useMemo<{ Header: string, accessor: string | undefined | ((d: IUserData["user"][number]) => string | number | undefined | JSX.Element) }[]>(
        () => [
            {
                Header: "Id",
                accessor: 'id'
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Phone',
                accessor: 'phone',
            },
            {
                Header: 'Email',
                accessor: 'email',
            },
            {
                Header: 'DOB',
                accessor: 'user_detail.date_of_birth'
            },
            {
                Header: 'gender',
                accessor: 'user_detail.gender',
            },
            {
                Header: 'Nationality',
                accessor: 'user_detail.country.name',
            },
            {
                Header: "Role",
                accessor: (data)=>data.user_roles.map((v) =>v.role.name).join(' ')
            },
            {
                Header: 'Created at',
                accessor: 'created_at'
            },
            {
                Header: 'Status',
                accessor: (data) => <button onClick={() => setApprovedMutation({ variables: { id: data.id, isActive: !data.isActive } })} className={`${style["property-approve-btn"]} ${data.isActive ? style["disapprove"] : ""}`}>{data.isActive ? "Disable" : "Enable"}</button>,
            },

        ],
        []
    )
    return <>
        {Loader}
        <div>
            <Table
                columns={columns}
                data={result}
                sortData={
                    {
                        fields:
                            { "name": "Name", "email": "Email", "user_detail.date_of_birth": "DOB", "user_detail.country.name": "Nationality", "created_at": "Created", "isActive": "Status" },
                        onChange: onSortChange
                    }
                } />
        </div>
    </>
}







