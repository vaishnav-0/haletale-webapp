import React from 'react';
import Header from '../components/Header';
import Body from '../components/Body';
import Footer from '../components/Footer';
import style from './Layout.module.scss';

type props = {
    children: React.ReactNode,
    footer?: boolean
}
function Layout({ children, footer }: props): JSX.Element {
    return (
        <div className={style["VP"]}>
            <Header />
            <Body>
                {children}
            </Body>
            {footer && <Footer />}
        </div>
    );
}

export default Layout;
