import React from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';

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
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
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
        {rows.map((row, i) => {
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
  )
}




