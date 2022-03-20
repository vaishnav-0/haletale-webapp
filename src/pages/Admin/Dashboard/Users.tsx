

import React from 'react';
import { useTable, usePagination } from 'react-table'
import style from './styles.module.scss';
import { gql, useMutation, useQuery } from '@apollo/client'
import propertyQuery, { IGetAllPropertyData, IPropertyDetails } from '../../../queries/property.query';
import { useNavigate } from 'react-router-dom';
import ImageSlider from '../../../components/ImageSlider';
import propertyMutation from '../../../queries/property.mutation';
import { useLoader } from '../../../components/Loader';
import requestsQuery, { IRequestData } from '../../../queries/requests.query';
import requestMutation from '../../../queries/request.mutation';
import userQuery, { IUserData } from '../../../queries/user.query';
import { userMutation } from '../../../queries';

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
    const [setApprovedMutation, { data: setApprovedMutationData, loading: setApprovedutationLoading }] = useMutation(userMutation.SET_USER_STATUS, { onCompleted: refetch })

    const result = React.useMemo(() => allUserData?.user ?? [], [allUserData])
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
                Header: 'Created at',
                accessor: 'created_at'
            },
            {
                Header: 'Status',
                accessor: (data) => <button disabled={setApprovedutationLoading} onClick={() => setApprovedMutation({ variables: { id: data.id, isActive: !data.isActive } })} className={`${style["property-approve-btn"]} ${data.isActive ? style["disapprove"] : ""}`}>{data.isActive ? "Disable" : "Enable"}</button>,
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


// table fn reusabl..


function Table({ columns, data }: { columns: any, data: any }) {
    const {

        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        usePagination
    )

    return (
        <>
            <table {...getTableProps()} className={style["table"]}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>



            {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}


            <div className={style["pagination"]}>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>{' '}
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{ width: '100px' }}
                    />
                </span>{' '}
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>)

}






