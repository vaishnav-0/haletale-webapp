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
    coords?: [number, number]
}
export default function CoordinateInput({ onChange = () => { }, style, className, coords, ...props }: PropsType) {
    const [map, setMap] = React.useState<Map>(null!);
    React.useEffect(() => {
        if (map) {
            const center = map.getCenter();
            onChange([center.lat, center.lng]);
            const onMoveEnd = (e: any) => {
                const center = map.getCenter();
                onChange([center.lat, center.lng]);
            }
            map.addEventListener('moveend', onMoveEnd);
            return () => {
                map.removeEventListener('moveend', onMoveEnd);
            }
        }
    }, [map])
    React.useEffect(() => {
        if (coords && map) {
            map.flyTo(coords, 15, { duration: 1 });
        }
    }, [coords]);
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