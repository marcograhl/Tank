"use client"
import MarkerClusterGroup from '../node_modules/@changey/react-leaflet-markercluster/src/react-leaflet-markercluster'
import { Station, LatLng } from '@/types/tankstellen-types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'







type Props = {
  zoom: number;
  center: LatLng;
  locations: Station[];
}


function Map({ zoom, center, locations }: Props) {
  console.log(locations)
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
        {locations.map(({ lat, lng, name }) => (
          <Marker position={[lat, lng]}>
            <Popup>{name}</Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>

    </MapContainer>
  )
}



export default Map;
