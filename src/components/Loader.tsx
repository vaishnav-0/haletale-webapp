import React from "react";
import { Oval } from "react-loader-spinner";
import style from './Loader.module.scss';


const setLoaderRef: { current: null | React.Dispatch<React.SetStateAction<boolean>> } = { current: null };
const setLoader = (enable: boolean) => {
    console.log(enable, setLoaderRef.current)
    setLoaderRef.current && setLoaderRef.current(enable);
}

export default function Loder() {
    const [enabled, setEnabled] = React.useState(false);
    React.useLayoutEffect(() => {
        setLoaderRef.current = setEnabled;
    }, [])
    console.log(enabled)
    return <>{enabled &&
        <div className={style["loader-container"]}>
            <Oval secondaryColor="#FFFFFF" strokeWidth={4} color="#08ada7" height={60} width={60} />
        </div>
    }
    </>
}
export { setLoader }