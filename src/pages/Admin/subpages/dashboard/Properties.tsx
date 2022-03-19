import React from 'react';
import { useTable, usePagination } from 'react-table'

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


    const result = React.useMemo(() => data, [])


    // table structure
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


    // chng page

    return <>
        <div>
        <Table columns={columns} data={result} />
        </div>
    </>
}


// table fn reusabl..


function Table({ columns  , data }: { columns : any , data : any }) {
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
  } =useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 2 },
    },
    usePagination
  )

  return(
   <>
     <table {...getTableProps()}>
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



      <div className="pagination">
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




