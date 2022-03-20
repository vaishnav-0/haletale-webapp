import React from 'react';
import { useTable, usePagination } from 'react-table'
import style from './styles.module.scss';
import { gql, useMutation, useQuery } from '@apollo/client'
import propertyQuery, { IGetAllPropertyData, IPropertyDetails } from '../../../queries/property.query';
import { useNavigate } from 'react-router-dom';
import ImageSlider from '../../../components/ImageSlider';
import propertyMutation from '../../../queries/property.mutation';
import { useLoader } from '../../../components/Loader';

export default function Properties() {
  const navigate = useNavigate();
  //data
  const { data: allPropertyData, loading: propertyLoading, refetch } = useQuery<IGetAllPropertyData>(propertyQuery.GET_ALL_PROPERTIES, {
    fetchPolicy: "cache-and-network"
  });
  React.useEffect(() => {
    if (propertyLoading)
      setLoader(true)
    else
      setLoader(false)
  }, [propertyLoading])
  const [Loader, setLoader] = useLoader({});
  const [setApprovedMutation, { data: setApprovedMutationData, loading: setApprovedutationLoading }] = useMutation(propertyMutation.UPDATE_IS_APPROVED, { onCompleted: refetch })
  const [data, setData] = React.useState<readonly IPropertyDetails[]>([]);
  const [current_page, setPage] = React.useState<Number>(0);
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  const result = React.useMemo(() => allPropertyData?.property ?? [], [allPropertyData])

  console.log(result)

  // table structure
  const columns = React.useMemo<{ Header: string, accessor: string | undefined | ((d: IPropertyDetails) => string | number | undefined | JSX.Element) }[]>(
    () => [
      {
        Header: 'Id',
        accessor: (data) => <button title={data.id} style={{ width: "100px" }} className={style["link-btn"]} onClick={() => navigate("/property/view?id=" + data.id)}>{data.id}</button>,
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Approval',
        accessor: (data) => <button disabled={setApprovedutationLoading} onClick={() => setApprovedMutation({ variables: { id: data.id, is_approved: !data.is_approved } })} className={`${style["property-approve-btn"]} ${data.is_approved ? style["disapprove"] : ""}`}>{data.is_approved ? "Remove approval" : "Approve"}</button>,
      },
      {
        Header: 'Full Address',
        accessor: (data) => data.property_address?.address?.full_address,
      },
      {
        Header: 'Type & Subtype',
        accessor: (data) => data.property_type.name + " " + data.property_subtype.name
      },
      {
        Header: 'Rent Amount',
        accessor: (data) => data.property_detail?.rent_amount,
      },
      {
        Header: "Images",
        accessor: (data) => <ImageSlider className={style["image-slider"]} aspectRatio={16 / 9} imgSrc={data.property_images?.map(e => e!.s3Url!.url as string) ?? []} />
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'features',
        accessor: (data) => data.property_detail?.features?.join(' '),
      },
      {
        Header: 'Resrictions',
        accessor: (data) => data.property_detail?.restrictions?.join(' '),
      },
      {
        Header: "Rooms",
        accessor: (data) => Object.entries(data.property_detail?.rooms ?? {}).map(([k, v]) => k + ":" + v).join(' ')
      },
      {
        Header: "Max occupant",
        accessor: (data) => data.property_detail?.max_occupants
      },
      {
        Header: 'Listed',
        accessor: (data) => data.is_listed.toString(),
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




