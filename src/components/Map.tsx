import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Map as LeafletMap } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pinIcon from '../assets/icons/map_pin.svg';
import style from './Map.module.scss';

export type MarkerType = { onClick: () => void, coords: [number, number] }[]
const iconPin = new L.Icon({
    iconUrl: pinIcon,
    iconRetinaUrl: pinIcon,
    iconSize: new L.Point(60, 75),
    className: style['location-pin']
});
type propType = {
    className?: string;
    whenCreated?: any
    markers?: MarkerType
}
export default function ({ className, whenCreated, markers = [] }: propType): JSX.Element {
    const [map, setMap] = React.useState<LeafletMap>(null!);
    React.useEffect(() => {
        whenCreated(map);
    }, [map])
    return <MapContainer whenCreated={(map: LeafletMap) => setMap(map)} className={className} scrollWheelZoom={true}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
            markers.map((marker) => <Marker eventHandlers={{
                click: (e) => {
                    marker.onClick();
                },
            }}
                position={[marker.coords[0], marker.coords[1]]} icon={iconPin} />
            )

        }
    </MapContainer>
}