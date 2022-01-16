import React from 'react';
import './normalize.css';
import './base.scss';
import AuthProvider from './functions/auth/authProvider';
import Router from './routes';

import { ApolloProvider } from '@apollo/client';
import graphQLClient from './apolloClient';

function App() {
  const client = graphQLClient();
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <Router />
      </ApolloProvider>
    </AuthProvider>
  );
}

export default App;
