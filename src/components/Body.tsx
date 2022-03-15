import React from 'react';
import "./Body.scss";
const Body = function ({ children, className, ...props }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element {
    return (
        <div className={"body" + (className ? ` ${className}` : "")} {...props}>
            {children}

        </div>
    );
}

export default Body;