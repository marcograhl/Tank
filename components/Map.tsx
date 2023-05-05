"use client"

// @ts-ignore
import MarkerClusterGroup from '../node_modules/@changey/react-leaflet-markercluster/src/react-leaflet-markercluster'
import { Station, LatLng } from '@/types/tankstellen-types';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'

type Props = {
  zoom: number;
  center: LatLng;
  stations: Station[];
}


function Map({ zoom, center, stations }: Props) {
  return (
    <MapContainer
      // @ts-ignore
      zoom={zoom}
      center={center}
      scrollWheelZoom={false}
    >
      <TileLayer
        // @ts-ignore
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup>
        {stations.map(({ lat, lng, name,id }) => (
          <Marker key={id} position={[lat, lng]}>
            <Popup>{name}</Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    <MapController zoom={zoom} center={center} />
    </MapContainer>
  )
}

type MapControllerProps = {
  center: LatLng;
  zoom: number;
};

function MapController({ center, zoom }: MapControllerProps) {
  /* map enthält die Leaflet-Instanz. */
  const map = useMap();
  /* Hier werden Methoden der Leaflet-Bibliothek verwendet, ganz unabhängig
        von React!
        https://leafletjs.com/reference-1.7.1.html#map-methods-for-modifying-map-state
        (Achtung: Da map.setView() das map-Objekt zurückgibt, müssen wir bei der Callback-
        Funktion in useEffect geschweifte Klammern verwenden, um die automatische Rückgabe
        bei einzeiligen Pfeilfunktionen zu vermeiden. React würde sonst map für die 
        "Aufräum-Funktion" des Effekts halten und als Funktion aufrufen, was zum Absturz 
        des Programms führen würde.)
        */
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}




export default Map;
