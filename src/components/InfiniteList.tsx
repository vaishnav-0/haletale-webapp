import React from 'react';
import { useLazyQuery, DocumentNode, TypedDocumentNode, QueryLazyOptions, OperationVariables } from '@apollo/client';
import InView from 'react-intersection-observer';
import { useLoader } from './Loader';
//Infinite scroll using offset. Query must contain variable named offset.
export default function <TDataQuery, TAggrQuery>({ query, initialParams, children, wrapperClassName, checkSkip, aggregateQuery }:
    {
        query: DocumentNode | TypedDocumentNode<TDataQuery>,
        initialParams: QueryLazyOptions<OperationVariables> | undefined,
        children: (data: TDataQuery | undefined, loading: boolean) => JSX.Element | JSX.Element[],
        wrapperClassName?: string,
        checkSkip: (data: TDataQuery | undefined, aData: TAggrQuery | undefined) => boolean,
        aggregateQuery: DocumentNode | TypedDocumentNode<TAggrQuery>

    }): JSX.Element {
    const [lazyQuery, { data, loading, fetchMore, called }] = useLazyQuery<TDataQuery>(query, {
        notifyOnNetworkStatusChange: true
    });
    const [lazyAggrQuery, { data: aggData, loading: aggLoading }] = useLazyQuery<TAggrQuery>(aggregateQuery);
    const [Loader, setLoader] = useLoader({});
    React.useEffect(() => {
        lazyAggrQuery(initialParams);
        lazyQuery(initialParams);
    }, [initialParams]);
    // React.useEffect(() => {
    //     //setLoader(true);
    // }, [initialParams]);
    // console.log(loading)
    // React.useEffect(() => {
    //     if (called)
    //         setLoader(false);
    // }, [called])
    return (
        <div className={wrapperClassName}>
            {
                children(data, loading)
            }
            {Loader}
            <InView
                onChange={inView => {
                    if (inView) {
                        fetchMore({
                            variables: {
                                offset: (data as any)?.[Object.keys(data!)[0]].length // data should contain the required item in the array form first.
                            }
                        })
                    }
                }}
                skip={checkSkip(data, aggData)}
            />
        </div>
    );
}
