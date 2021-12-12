import React from "react";
export function useClickOutsideEvent(ref, onClick = () => { }) {
    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            onClick();
        }
    };
    React.useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);
}