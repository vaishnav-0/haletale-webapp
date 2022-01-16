import {
    ApolloClient,
    InMemoryCache,
} from "@apollo/client";


const graphQLClient = () => new ApolloClient({
    uri: 'http://3.99.146.234:8080/v1/graphql',
    cache: new InMemoryCache()
});



export default graphQLClient;
