import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, from } from "@apollo/client";
import { onError } from '@apollo/client/link/error';
import { ServerError } from "@apollo/client/link/utils";
import Token from "./functions/auth/token";


const token = new Token("id");


const httpLink = new HttpLink({
    uri: 'http://ec2-35-183-39-216.ca-central-1.compute.amazonaws.com:8080/v1/graphql',
});


const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }: { headers: object }) => ({
        headers: {
            ...headers,
            authorization: token.get() || null,
        }
    }));

    return forward(operation);
});

const logoutLink = onError(({ networkError }) => {
    if (networkError && (networkError as ServerError).statusCode === 401)
        //   logout(); to be implemented
        return
})


const graphQLClient = () => new ApolloClient({
    cache: new InMemoryCache(),
    link: from([authMiddleware, logoutLink, httpLink])
});



export default graphQLClient;
