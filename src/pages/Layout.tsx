import React from 'react';
import Header from '../components/Header';
import Body from '../components/Body';
import Footer from '../components/Footer';
import style from './Layout.module.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        </div>
    );
}

export default Layout;
