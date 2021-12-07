import React from 'react';
import './normalize.css';
import './base.css';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer'


function App() {
  return (
    <div className="VP">
      <Header />
      <div className="body"></div>
      <Footer />
    </div>
  );
}

export default App;
