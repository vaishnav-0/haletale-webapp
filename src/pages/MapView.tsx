import React from "react"
import Map from "../components/Map"
import style from './MapView.module.scss';
import { Openable } from "../components/Openable";
import FilterModel from "../components/FilterModal";
import { MarkerType } from "../components/Map";
import MapViewTile from "../components/MapViewTile";
import Layout from "./Layout";
import cloneDeep from "clone-deep";
import { IPropertyDetails } from "../queries/property.query";
import CenterContent from "../components/CenterContent";

function MapView({ properties, onClose = () => { } }: { properties: IPropertyDetails[], onClose?: () => void }): JSX.Element {
    const [filterOpen, setFilterOpen] = React.useState(false);
    const [map, setMap] = React.useState<any>(null!);
    const [selected, setSelected] = React.useState<number>(-1);
    const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    const [markers, setMarkers] = React.useState<MarkerType>([]);
    React.useEffect(() => {
        if (itemRefs.current?.length > 0) {
            const mark: MarkerType = [];
            properties.forEach((property, i) => {
                mark[i] = {
                    onClick: () => {
                        setSelected(i);
                        itemRefs.current[i]?.scrollIntoView({ behavior: "smooth", inline: "center" });
                    },
                    coords: property.coordinates.coordinates
                }
            });
            setMarkers(mark);

        }
    }, [])
    React.useEffect(() => {
        if (map) {
            map.invalidateSize();
            map.fitBounds(properties.map(p => p.coordinates.coordinates));
            map.zoomOut(2);
        }
    }, [map]);
    return <div className={style["wrapper"]}>
        <button className={style["close-btn"]} onClick={onClose}>
            <i className="fas fa-times" />
        </button>
        {
            markers.length > 0 ?
                <Map markers={markers} className={style["map"]} containerClassName={style["map-container"]} whenCreated={setMap}></Map>
                :
                <CenterContent>
                    <p style={{ fontSize: "2rem" }}>No Properties to display</p>
                </CenterContent>

        }
        <div className={style["item-wrapper"]}>
            <button className={style["filter-btn"]} onClick={() => { setFilterOpen(true); }}><i className="fas fa-sliders-h"></i></button>
            <div className={style["filter-background"]} style={{ display: filterOpen ? "" : "none" }}>
                <Openable
                    className={style["filter-container"]} open={[filterOpen, setFilterOpen]}>
                    <FilterModel onClose={() => {
                        setFilterOpen(false);
                    }} />

                </Openable>
            </div>
            <div className={style["item-container"]}>
                {
                    properties.map((property, i) => {
                        return <MapViewTile
                            property={property}
                            onClick={() => {
                                setMarkers(markers => {
                                    const _markers = cloneDeep(markers);
                                    _markers[i].highlight = true;
                                    return _markers;
                                })
                                map?.flyTo(property.coordinates.coordinates, 18, { animate: true, duration: 0.6 });
                                setSelected(i);
                            }
                            }
                            ref={(el) => itemRefs.current[i] = el}
                            highlight={selected === i}
                        />
                    })
                }
            </div>
        </div>
    </div>
}

export default React.memo(MapView);