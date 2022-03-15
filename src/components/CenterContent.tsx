import React from "react";

export default function CenterContent(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    return <div {...props} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
        {
            props.children
        }
    </div>
}