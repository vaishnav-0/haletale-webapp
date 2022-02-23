import React from 'react';
import './normalize.css';
import './base.scss';
import AuthProvider from './functions/auth/authProvider';
import Router from './routes';
import Loader from './components/Loader';
import { ApolloProvider } from '@apollo/client';
import graphQLClient from './apolloClient';

function App() {
  const client = graphQLClient();
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router />
        <Loader />
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
