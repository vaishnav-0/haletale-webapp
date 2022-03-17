import React from 'react';
import { useLazyQuery, DocumentNode, TypedDocumentNode, QueryLazyOptions, OperationVariables } from '@apollo/client';
import InView from 'react-intersection-observer';
import { useLoder } from './Loader';
//Infinite scroll using offset. Query must contain variable named offset.
export default function <T>({ query, initialParams, children, wrapperClassName, checkSkip }:
    {
        query: DocumentNode | TypedDocumentNode<T>,
        initialParams: QueryLazyOptions<OperationVariables> | undefined,
        children: (data: T | undefined, loading: boolean) => JSX.Element | JSX.Element[],
        wrapperClassName?: string,
        checkSkip: (data: T | undefined) => boolean

    }): JSX.Element {
    let [lazyQuery, { data, loading, fetchMore, called }] = useLazyQuery<T>(query, {
        notifyOnNetworkStatusChange: true
    });
    const [Loader, setLoader] = useLoder({});
    React.useEffect(() => {
        lazyQuery(initialParams);
    }, [initialParams]);
    React.useEffect(() => {
        if (!data && loading)
            setLoader(true);
        else
            setLoader(false);
    }, [called, loading])
    console.log(loading)
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
                skip={checkSkip(data)}
            />
        </div>
    );
}
