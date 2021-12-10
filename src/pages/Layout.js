import React from 'react';
import Header from '../components/Header';
import Body from '../components/Body';
import Footer from '../components/Footer';
function Layout({ children, footer }) {
    return (
        <div className="VP">
            <Header />
            <Body>
                {children}
            </Body>
            {footer && <Footer/>}
        </div>
    );
}

export default Layout;
