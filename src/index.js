import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
import './normalize.css';
import './base.scss';
import Router from './routes';

ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('root')
);


