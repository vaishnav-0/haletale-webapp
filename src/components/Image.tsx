
import React from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

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
        !loaded && <Skeleton className={props.className} style={props.style} />

    }
        {
            <img ref={imgRef} onLoad={() => setLoaded(true)} {...props} style={{ width: loaded ? "" : 0 }} />
        }
    </>
}