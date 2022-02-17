import React from "react"
import Map from "../components/Map"
import style from './MapView.module.scss';
import { Openable } from "../components/Openable";
import FilterModel from "../components/FilterModal";
import { MarkerType } from "../components/Map";
import MapViewTile from "../components/MapViewTile";
const coordList: [number, number][] = [[49.964714, -97.189074], [49.961505, -97.196203], [49.964422, -97.152835], [49.943581, -97.167384],[49.943481, -97.157384],[49.943181, -97.152384]];
export default function MapView(): JSX.Element {
    const [filterOpen, setFilterOpen] = React.useState(false);
    const [map, setMap] = React.useState<any>(null!);
    const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    const [markers, setMarkers] = React.useState<MarkerType>([]);
    React.useEffect(() => {
        if (itemRefs.current?.length > 0) {
            const mark: MarkerType = [];
            coordList.forEach((coords, i) => {
                mark[i] = {
                    onClick: () => {
                        itemRefs.current[i]?.scrollIntoView({ behavior: "smooth", inline: "center" });
                    },
                    coords: coords
                }
            });
            setMarkers(mark);
        }
    }, [])
    React.useEffect(() => {
        if (map) {
            map.invalidateSize();
            map.fitBounds(coordList);
            map.zoomOut(2);
        }
    }, [map]);
    return <div>
        {
            markers.length > 0 &&
            <Map markers={markers} className={style["map"]} whenCreated={setMap}></Map>

        }
        <div className={style["wrapper"]}>
            <button className={style["filter-btn"]} onClick={() => { setFilterOpen(true); }}><i className="fas fa-sliders-h"></i></button>
            <div className={style["filter-background"]} style={{ display: filterOpen ? "" : "none" }}>
                <Openable
                    className={style["filter-container"]} open={[filterOpen, setFilterOpen]}>
                    <FilterModel onClose={() => {
                        setFilterOpen(false);
                    }} />

                </Openable>
            </div>
            <div className={style["container"]}>
                {
                    coordList.map((coords, i) => {
                        return <MapViewTile
                            onClick={() =>
                                map?.flyTo(coords, 18, { animate: true, duration: 1 })}
                            ref={(el) => itemRefs.current[i] = el}
                        />
                    })
                }
            </div>
        </div>
    </div>
}