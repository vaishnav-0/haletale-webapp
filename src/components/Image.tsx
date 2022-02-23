
import React from 'react';
import ContentLoader from 'react-content-loader';

export default function (props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & { default?: string }) {
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const imgRef = React.useRef<HTMLImageElement>(null);
    const onError = () => {
        if (imgRef.current)
            imgRef.current.src = props.default ?? "";
    }
    React.useEffect(() => {
        if (!props.src || props.src === "")
            imgRef.current!.src = props.default ?? "";
    }, [props.src])
    return <>{
        !loaded && <ContentLoader
            className={props.className}
        >
            <rect height="100%" width="100%" />
        </ContentLoader>

    }
        <img ref={imgRef} onLoad={() => setLoaded(true)} {...props} style={{ height: loaded ? "" : 0 }} />
    </>
}