import React, { useState } from 'react';
import style from './ScrollButton.module.scss';
const ScrollButton = ({ container }: { container: HTMLElement }) => {
    const [visible, setVisible] = useState(false);
    const visibleRef = React.useRef(visible);
    visibleRef.current = visible;
    React.useEffect(() => {
        const toggleVisible = () => {
            const scrolled = container?.scrollTop;
            if (scrolled > 300 && !visibleRef.current) {
                setVisible(true)
            }
            else if (scrolled <= 300 && visibleRef.current) {
                setVisible(false)
            }
        };

        container?.addEventListener('scroll', toggleVisible);
    }, [container])
    const scrollToTop = () => {
        console.log(container)
        container &&
            container.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
    };
    return (
        <button
            onClick={scrollToTop}
            className={style["button"]}
            style={{
                display: visible ? 'inline' : 'none'
            }}>
            To top
            <i className="fas fa-arrow-up" />
        </button>
    );
}

export default ScrollButton;