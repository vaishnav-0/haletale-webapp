import React from 'react';
import { useLazyQuery, DocumentNode, TypedDocumentNode, QueryLazyOptions, OperationVariables } from '@apollo/client';
import InView from 'react-intersection-observer';
//Infinite scroll using offset. Query must contain variable named offset.
export default function <T>({ query, initialParams, children, wrapperClassName, checkSkip }:
    {
        query: DocumentNode | TypedDocumentNode<T>,
        initialParams: QueryLazyOptions<OperationVariables> | undefined,
        children: (data: T | undefined, loading: boolean) => JSX.Element | JSX.Element[],
        wrapperClassName?: string,
        checkSkip: (data: T | undefined) => boolean

    }): JSX.Element {
    let [lazyQuery, { data, loading, fetchMore }] = useLazyQuery<T>(query, {
        notifyOnNetworkStatusChange: true
    });
    React.useEffect(() => {
        lazyQuery(initialParams);
    }, [])
    return (
        <div className={wrapperClassName}>
            {
                children(data, loading)
            }
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
                skip={checkSkip(data)}
            />
        </div>
    );
}
