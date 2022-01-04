import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pinIcon from '../assets/icons/map_pin.svg';
import style from './Map.module.scss';

const iconPin = new L.Icon({
    iconUrl: pinIcon,
    iconRetinaUrl: pinIcon,
    iconSize: new L.Point(60, 75),
    className: style['location-pin']
});
type props = {
    title: string;
}
export default function (): JSX.Element {
    return <MapContainer style={{ height: "200px" }} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]} icon={iconPin}>
            <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
        </Marker>
    </MapContainer>
}