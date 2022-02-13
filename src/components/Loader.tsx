import { Oval } from "react-loader-spinner";
import style from './Loader.module.scss';
export default function Loder() {
    return <div className={style["loader-container"]}>
        <Oval secondaryColor="#FFFFFF" strokeWidth={4} color="#08ada7" height={60} width={60} />
    </div>
}