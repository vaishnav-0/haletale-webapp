import React from 'react';
import ReactDOM from 'react-dom';
import './normalize.css';
import './base.scss';
import Router from './routes';

ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('root')
);


