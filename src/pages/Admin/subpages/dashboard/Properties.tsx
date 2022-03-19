import React from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';


//material ui tbl
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Container
} from '@material-ui/core';

import { gql } from '@apollo/client'

const GET_PROPERTIES = gql`query GET_PROPERTIES {
    property {
      coordinates
      description
      id
      is_approved
      name
      property_detail {
        rent_amount
      }
    }
  }`;

export type  TPropertyResponse = {
    coordinates: {
        latitude: Number,
        longitude: Number
    },
    description: string,
    id: string,
    is_approved: boolean,
    name: string,
    property_detail: {
        rent_amount: Number
    }
}

export default function Properties() {

    //data
    const [data, setData] = React.useState<readonly TPropertyResponse[]>();
    const [current_page, setPage] = React.useState<Number>(0);
    const [searchTerm, setSearchTerm] = React.useState<string>("");

    // table structure


    // chng page
    const changePage = (page: number) => {

        gotoPage(page);
    }

    const columns = React.useMemo(
        () => [

            {
                Header: 'Name',
                accessor: 'name', // accessor is the "key" in the data
            },
            {
                Header: 'Full Address',
                accessor: 'full_address',
            },
            {
                Header: 'Type & Subtype',
                accessor: 'category',
            },
            {
                Header: 'Rent Amount',
                accessor: 'rent',
            },
            {
                Header: 'Owner',
                accessor: 'owner_name',
            },
            {
                Header: 'Action',
                accessor: 'action',
            },

        ],
        []
    )


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize,
             // globalFilter 
        },
    //    setGlobalFilter
    } = useTable(
        {
            columns,
            data,
            autoResetPage: false,
            initialState: {
            //    globalFilter: searchTerm
            },
        },
        useGlobalFilter,
        usePagination
    )

    return <>
        <div>
            {/* <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}></GlobalFilter> */}
            <TableContainer component={Paper}>
                <Table {...getTableProps()} >
                    <TableHead>
                        {headerGroups.map(headerGroup => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <TableCell
                                        {...column.getHeaderProps()}
                                    >
                                        {column.render('Header')}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>



                    <TableBody {...getTableBodyProps()}>
                        {page.map((row, i) => {
                            prepareRow(row)
                            return (
                                <TableRow {...row.getRowProps()}>
                                    {row.cells.map((cell:any) => {
                                        return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                                    })}
                                </TableRow>
                            )
                        })}
                    </TableBody>


                </Table>
            </TableContainer>
            <div className="pagination">
                <Button onClick={() => changePage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </Button>{' '}
                <Button onClick={() => changePage(pageIndex - 1)} disabled={!canPreviousPage}>
                    {'<'}
                </Button>{' '}
                <Button onClick={() => changePage(pageIndex + 1)} disabled={!canNextPage}>
                    {'>'}
                </Button>{' '}
                <Button onClick={() => changePage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </Button>{' '}
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
                            changePage(page)
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
        </div>
    </>
}


