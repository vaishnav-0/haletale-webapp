import React from 'react';
import ReactDOM from 'react-dom';
import 'react-app-polyfill/stable';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
import './normalize.css';
import 'element-scroll-polyfill';
import './base.scss';

import App from './App';


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


