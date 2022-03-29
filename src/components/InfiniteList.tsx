import React from 'react';
import { useLazyQuery, DocumentNode, TypedDocumentNode, QueryLazyOptions, OperationVariables } from '@apollo/client';
import InView from 'react-intersection-observer';
import { useLoader } from './Loader';
import { useMemoized } from '../functions/hooks/useMemoized';
//Infinite scroll using offset. Query must contain variable named offset.
export default function useInfiniteList<TDataQuery extends object, TAggrQuery>({ query, initialParams, wrapperClassName, checkSkip, aggregateQuery, stop }:
    {
        query: DocumentNode | TypedDocumentNode<TDataQuery>,
        initialParams: QueryLazyOptions<OperationVariables> | undefined,
        wrapperClassName?: string,
        checkSkip: (data: TDataQuery | undefined, aData: TAggrQuery | undefined) => boolean,
        aggregateQuery: DocumentNode | TypedDocumentNode<TAggrQuery>,
        stop?: boolean

    }): [React.FC<{ children: (data: TDataQuery | undefined, loading: boolean) => JSX.Element | JSX.Element[] }>, TDataQuery | undefined, TAggrQuery | undefined] {
    const [lazyQuery, { data, loading, fetchMore, called }] = useLazyQuery<TDataQuery>(query, {
        notifyOnNetworkStatusChange: true,
    });
    const [lazyAggrQuery, { data: aggData, loading: aggLoading }] = useLazyQuery<TAggrQuery>(aggregateQuery, { fetchPolicy: "no-cache" });
    const [Loader, setLoader] = useLoader({});
    const updateListComponentFn = React.useRef<React.Dispatch<React.SetStateAction<boolean>>>();
    const dataRef = React.useRef(data);
    const loadingRef = React.useRef(loading);
    const aggDataRef = React.useRef(aggData);
    dataRef.current = data;
    loadingRef.current = loading;
    aggDataRef.current = aggData;
    React.useEffect(() => {
        if (!stop) {
            lazyAggrQuery(initialParams);
            lazyQuery(initialParams);
        }
    }, [initialParams]);
    // React.useEffect(() => {
    //     //setLoader(true);
    // }, [initialParams]);
    // console.log(loading)
    // React.useEffect(() => {
    //     if (called)
    //         setLoader(false);
    // }, [called])
    React.useEffect(() => {
        if (updateListComponentFn.current)
            updateListComponentFn.current(p => !p)
    }, [data, loading, aggData])
    const InfiniteList = useMemoized(() => function List({ children }: { children: ((data: TDataQuery | undefined, loading: boolean) => JSX.Element | JSX.Element[]) }) {
        const [, updateList] = React.useState<boolean>(false);
        React.useEffect(() => {
            updateListComponentFn.current = updateList;
        }, []);
        return (
            <div className={wrapperClassName}>
                {
                    children(dataRef.current, loadingRef.current)
                }
                {Loader}
                <InView
                    onChange={(inView, entry) => {
                        if (inView) {
                            fetchMore({
                                variables: {
                                    offset: (dataRef.current as any)?.[Object.keys(dataRef.current!)[0]].length // the first object element is taken.
                                }
                            })
                        }
                    }}
                    skip={checkSkip(dataRef.current, aggDataRef.current)}
                />
            </div>
        )
    }, [])
    return [InfiniteList, data, aggData];
}

export function InfiniteList<TDataQuery extends object, TAggrQuery>({ children, ...rest }:
    {
        query: DocumentNode | TypedDocumentNode<TDataQuery>,
        initialParams: QueryLazyOptions<OperationVariables> | undefined,
        children: (data: TDataQuery | undefined, loading: boolean) => JSX.Element | JSX.Element[],
        wrapperClassName?: string,
        checkSkip: (data: TDataQuery | undefined, aData: TAggrQuery | undefined) => boolean,
        aggregateQuery: DocumentNode | TypedDocumentNode<TAggrQuery>

    }): JSX.Element {
    const [List] = useInfiniteList<TDataQuery, TAggrQuery>(rest);

    return (
        <List>{children}</List>
    );
}