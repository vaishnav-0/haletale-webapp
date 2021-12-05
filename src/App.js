import React from 'react';
import Header from './components/Header';
import './normalize.css';
import './base.css';
import './App.css';

function App() {
  return (
    <div className="VP">
      <Header />
      <div className="body"></div>
      <div className="footer"></div>
    </div>
  );
}

export default App;
