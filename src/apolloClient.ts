import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, from } from "@apollo/client";
import { onError } from '@apollo/client/link/error';
import { ServerError } from "@apollo/client/link/utils";
import { getToken } from './functions/auth/token';

const httpLink = new HttpLink({
    uri: 'http://3.99.146.234:8080/v1/graphql',
});


const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }: { headers: object }) => ({
        headers: {
            ...headers,
            authorization: getToken() || null,
        }
    }));

    return forward(operation);
});

const logoutLink = onError(({ networkError }) => {
    if (networkError && (networkError as ServerError).statusCode === 401) { }
    //   logout(); to be implemented
});



const graphQLClient = () => new ApolloClient({
    cache: new InMemoryCache(),
    link: from([authMiddleware, logoutLink, httpLink])
});



export default graphQLClient;
