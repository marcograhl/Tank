"use client"
import { Station, LatLng } from '@/types/tankstellen-types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'




type Props = {
  zoom: number;
  center: LatLng;
  locations: Station[];
}


function Map({zoom, center, locations}: Props) {
  console.log(locations)
  const position = [
  locations[0].lat,
  locations[0].lng
  ]
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
      <Marker position={position}>
       <Popup>{locations[0].name}</Popup>
      </Marker>
  	</MapContainer>
  )
}


export default Map;
