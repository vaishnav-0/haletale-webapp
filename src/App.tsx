import React from 'react';
import './normalize.css';
import './base.scss';
import AuthProvider from './functions/auth/authProvider';
import Router from './routes';
import Loader from './components/Loader';
import { ApolloProvider } from '@apollo/client';
import graphQLClient from './apolloClient';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const client = graphQLClient();
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Router />
        <Loader />
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
