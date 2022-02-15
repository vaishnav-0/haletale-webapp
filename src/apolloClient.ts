import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, from } from "@apollo/client";
import { onError } from '@apollo/client/link/error';
import { ServerError } from "@apollo/client/link/utils";
import Token from "./functions/auth/token";
import { Observable } from "@apollo/client";
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
        retryIf: async (error, _operation) => {
            console.log(error)
            return false;
        }
    }
});
const promiseToObservable = (promise: Promise<any>) =>
    new Observable((subscriber: any) => {
        promise.then(
            value => {
                console.log(subscriber);
                if (subscriber.closed) return;
                subscriber.next(value);
                subscriber.complete();
            },
            err => subscriber.error(err)
        );
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
    if (networkError && (networkError as ServerError).statusCode === 401) {
        auth.refreshSession();
        return forward(operation);
    }

    if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) => {
            console.log(message)
        })
    }
    if (response) response.errors = undefined;
})




const graphQLClient = () => new ApolloClient({
    cache: new InMemoryCache(),
    link: from([authLink, retryLink, errorLink, httpLink])
});



export default graphQLClient;
