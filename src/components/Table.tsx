import React from "react";
import { useGlobalFilter, usePagination, useTable, useRowSelect } from "react-table";
import FormGenerator from "./Form/FormGenerator";
import style from './Table.module.scss';
import * as yup from 'yup';
import { TextInput } from "./Form/components/TextInput";
import debounce from "../functions/debounce";
import { CheckBox } from "./Form/components/ToggleButtons";
import { ButtonHollow } from "./Button";

export default function Table({ columns, data, sortData, actions }:
    { columns: any, data: any, sortData?: { fields: { [k: string]: string }, onChange: (e: any) => void }, actions?: { [k: string]: (d: any) => void } }) {
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
        setGlobalFilter,
        selectedFlatRows,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        useGlobalFilter,
        usePagination,
        useRowSelect,
        hooks => {
            hooks.visibleColumns.push(columns => [
                // Let's make a column for selection
                {
                    id: 'selection',
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: ({ getToggleAllPageRowsSelectedProps }) => (
                        <div>
                            <CheckBox name="select_all" {...getToggleAllPageRowsSelectedProps()} />
                        </div>
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <div>
                            <CheckBox name="select" {...row.getToggleRowSelectedProps()} />
                        </div>
                    ),
                },
                ...columns,
            ])
        }
    )
    const [currPage, setCurrPage] = React.useState(0);
    React.useEffect(() => {
        gotoPage(currPage);
    }, [data])
    const _gotoPage = (pgNo: number) => {
        setCurrPage(pgNo);
        gotoPage(pgNo);
    }
    const setFilter = debounce((v: any) => {
        setGlobalFilter(v);
    }, 500);
    return (
        <div>
            <div className={style["top-panel"]}>
                {
                    sortData && <div className={style["sort-container"]}>
                        <div>Sort:</div>
                        <div className={style["sort-dropdown-container"]}>
                            <FormGenerator
                                schema={{
                                    heading: "",
                                    wrapperStyle: { display: "flex", gap: "0.5em" },
                                    items: [
                                        {
                                            name: "sortBy",
                                            type: "select",
                                            props: {
                                                values: { "": "Field", ...sortData.fields },
                                                height: 40
                                            },
                                            validationSchema: yup.string().required("Please select an option.")

                                        },
                                        {
                                            name: "sortType",
                                            type: "select",
                                            props: {
                                                values: { "": "Type", asc: "Ascending", desc: "Descending" },
                                                height: 40
                                            },
                                            validationSchema: yup.string().required("Please select an option.")

                                        }
                                    ],
                                    submitButton: "Sort"
                                }}
                                onSubmit={sortData.onChange}
                            />
                        </div>
                    </div>
                }
                <div className={style["sort-container"]}>
                    <div>Search:</div>
                    <div className={style["sort-dropdown-container"]}>
                        <TextInput type="text" name="search" onChange={(v) => setFilter(v.target.value)} height={40} />
                    </div>
                </div>
                {
                    actions && <div className={style["sort-container"]}>
                        <div>Actions:</div>
                        <div className={style["action-container"]}>
                            {
                                Object.entries(actions).map(([label, action]) => (
                                    <ButtonHollow disabled={!selectedFlatRows.length} onClick={() => action(selectedFlatRows.map(row => row.original))} >{label}</ButtonHollow>
                                ))
                            }
                        </div>
                    </div>
                }
            </div>
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
            <div className={style["pagination"]}>
                <button onClick={() => _gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button onClick={() => _gotoPage(pageIndex - 1)} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button onClick={() => _gotoPage(pageIndex + 1)} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
                <button onClick={() => _gotoPage(pageCount - 1)} disabled={!canNextPage}>
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
                            _gotoPage(page)
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
        </div>)

}