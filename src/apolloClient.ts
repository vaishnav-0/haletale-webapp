import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, from, fromPromise } from "@apollo/client";
import { onError } from '@apollo/client/link/error';
import { ServerError } from "@apollo/client/link/utils";
import Token from "./functions/auth/token";
import { RetryLink } from "@apollo/client/link/retry"
import auth from './functions/auth'

const token = new Token("id");


const retryLink = new RetryLink({
    delay: {
        initial: 300,
        max: Infinity,
        jitter: true
    },
    attempts: {
        max: 5,
        retryIf: (error, _operation) => {
            console.log(error)
            return false;
        }
    }
});


const httpLink = new HttpLink({
    uri: 'http://ec2-35-183-39-216.ca-central-1.compute.amazonaws.com:8080/v1/graphql',
});


const authLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }: { headers: object }) => ({
        headers: {
            ...headers,
            Authorization: `Bearer ${token.get()}` || null,
        }
    }));

    return forward(operation);
});

const errorLink = onError(({ networkError, graphQLErrors, response, forward, operation }) => {
    console.log(operation.getContext())
    console.log(networkError, graphQLErrors)
    console.log(navigator.connection.type)
    if (networkError && (networkError as ServerError).statusCode === 401) {

    }
    if (graphQLErrors) {
        graphQLErrors.map((err) => {
            const { message, extensions: { code }, path } = err;
            console.log(err)
            if (code === 'invalid-jwt')
                return fromPromise(new Promise((res, rej) => {
                    auth.refreshSession((err) => {
                        if (!err)
                            res(true)
                        else
                            res(false);
                    })
                })).filter(x => { console.log(x); return !!x }).flatMap(() => {
                    const oldHeaders = operation.getContext().headers;
                    console.log(token.get());
                    // modify the operation context with a new token
                    operation.setContext({
                        headers: {
                            ...oldHeaders,
                            Authorization: `Bearer ${token.get()}`,
                        },
                    });
                    return forward(operation)
                })
        })
    }
    if (response) response.errors = undefined;
})




const graphQLClient = () => new ApolloClient({
    cache: new InMemoryCache(),
    link: from([authLink, retryLink, errorLink, httpLink])
});



export default graphQLClient;
