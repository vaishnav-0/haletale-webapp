import React from "react";
import MapComponent from "../../../components/Map"
import { Map, LatLng } from "leaflet";
import pinIcon from '../../../assets/icons/map_pin.svg';
import CSSstyle from './CoordinateInput.module.scss';
import { MapContainerProps } from 'react-leaflet';
export interface PropsType extends MapContainerProps {
    onChange?: (value: [number, number]) => void,
    style?: React.CSSProperties,
    className?: string,
    value?: [number, number]
}
export default function CoordinateInput({ onChange = () => { }, style, className, value, ...props }: PropsType) {
    const [map, setMap] = React.useState<Map>(null!);
    const value_ = React.useRef<[number, number]>(null!)
    React.useEffect(() => {
        if (map) {
            const center = map.getCenter();
            onChange([center.lat, center.lng]);
            const onMoveEnd = (e: any) => {
                const center = map.getCenter();
                onChange([center.lat, center.lng]);
                value_.current = [center.lat, center.lng];
            }
            map.addEventListener('moveend', onMoveEnd);
            return () => {
                map.removeEventListener('moveend', onMoveEnd);
            }
        }
    }, [map])
    React.useEffect(() => {
        if (value && map && value !== value_.current) {
            map.flyTo(value, 14);
        }
    }, [value]);
    return <div className={CSSstyle["map-container"]}>
        <MapComponent whenCreated={setMap}
            worldCopyJump
            style={{
                ...(style && className) ? {} : {
                    height: "400px"
                }, ...style
            }} {...props} />
        <img className={CSSstyle["centermarker"]} src={pinIcon} />
    </div>
}