import React from 'react';
import Header from '../components/Header';
import Body from '../components/Body';
import Footer from '../components/Footer';
import style from './Layout.module.scss';

type props = {
    children: React.ReactNode,
    footer?: boolean,
    bodyClassName?: string
}
function Layout({ children, footer, bodyClassName }: props): JSX.Element {
    return (
        <div className={style["VP"]}>
            <Header />
            <Body className={bodyClassName}>
                {children}
            </Body>
            {footer && <Footer />}
        </div>
    );
}

export default Layout;
