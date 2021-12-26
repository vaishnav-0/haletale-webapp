import React from 'react';
import "./Body.scss";
const Body = function ({ children }: { children: React.ReactNode; }): JSX.Element {
    return (
        <div className="body">
            {children}

        </div>
    );
}

export default Body;