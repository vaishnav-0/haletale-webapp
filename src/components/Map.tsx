import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, MapContainerProps } from 'react-leaflet'
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
interface propType extends MapContainerProps {
    markers?: MarkerType
}
export default function ({ whenCreated, markers = [], ...props }: propType): JSX.Element {
    const [map, setMap] = React.useState<LeafletMap>(null!);
    React.useEffect(() => {
        if (whenCreated)
            whenCreated(map);
    }, [map])
    return <MapContainer whenCreated={(map: LeafletMap) => setMap(map)} {...props}>
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