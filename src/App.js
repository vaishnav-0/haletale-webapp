import React from 'react';
import './normalize.css';
import './base.scss';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer'
import Body from './components/Body';
import HomeBanner from './components/HomeBanner';
import MinimalPropertyList from './components/MinimalPropertyList';
function App() {
  return (
    <div className="VP">
      <Header />
      <Body>
        <HomeBanner />
        <MinimalPropertyList />
      </Body>
      <Footer />
    </div>
  );
}

export default App;
