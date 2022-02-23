
import React from 'react';
import ContentLoader from 'react-content-loader';

export default function (props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
    const [loaded, setLoaded] = React.useState<boolean>(false);

    return <>{
        !loaded && <ContentLoader
            className={props.className}
        >
            <rect height="100%" width="100%" />
        </ContentLoader>

    }
        <img onLoad={() => setLoaded(true)} {...props} style={{ height: loaded ? "" : 0 }} />
    </>
}