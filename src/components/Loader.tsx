import React from "react";
import { Oval } from "react-loader-spinner";
import style from './Loader.module.scss';
import { objectMap } from '../functions/utils';

type PropsType = {
    backgroundColor?: string,
    color?: string,
    secondaryColor?: string
}
const setLoaderRef: { current: null | ((enable: boolean, config?: PropsType) => void) } = { current: null };
const setLoader = (enable: boolean, config?: PropsType) => {
    console.log(enable, setLoaderRef.current)
    setLoaderRef.current && setLoaderRef.current(enable, config);
}

export default function Loder({ backgroundColor, color = "#08ada7", secondaryColor = "#FFFFFF" }: PropsType) {
    const [enabled, setEnabled] = React.useState(false);
    const defConfig: PropsType = {
        backgroundColor,
        color,
        secondaryColor
    }
    const propRef = React.useRef(defConfig)
    React.useLayoutEffect(() => {
        setLoaderRef.current = (enable: boolean, config?: PropsType) => {
            if (config)
                propRef.current = objectMap(defConfig, (k, v) => [k, !!(config as any)[k] ? (config as any)[k] : v]);
            setEnabled(enable);
        }
    }, [])
    return <>{enabled &&
        <div className={style["loader-container"]} style={{ backgroundColor: propRef.current.backgroundColor }} >
            <Oval secondaryColor={propRef.current.secondaryColor} strokeWidth={4} color={propRef.current.color} height={60} width={60} />
        </div>
    }
    </>
}
export { setLoader }