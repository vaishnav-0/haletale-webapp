
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
                accessor:
                 (data) => data.other_tenents.map((t: any) => {
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





