import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, MapContainerProps } from 'react-leaflet'
import { Map as LeafletMap } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pinIcon from '../assets/icons/map_pin.svg';
import style from './Map.module.scss';
import mapBoxLogo from '../assets/icons/mapbox-logo-black.png';

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
    return <div className={style["map-container"]}>
        <img src={mapBoxLogo} className={style["attribution-logo"]} />
        <MapContainer whenCreated={(map: LeafletMap) => setMap(map)} {...props}>
            <TileLayer
                attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>| &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://www.mapbox.com/map-feedback/"" target="_blank">Improve this map</a>'
                url="https://api.mapbox.com/styles/v1/vaishnav-/cl0pigcft006214qi39qf49fz/tiles/{z}/{x}/{y}?access_token=sk.eyJ1IjoidmFpc2huYXYtIiwiYSI6ImNsMHBpb2R4bTAzdnYzbHFyeXBneWpnbDMifQ.gQ5AC7e_gLkvAjMkTuvbag"
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
    </div>
}