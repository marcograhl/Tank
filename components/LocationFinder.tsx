'use client'
import { Station } from "@/types/tankstellen-types";
import dynamic from "next/dynamic";
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
});



type Props = {
  locations: Station[];
}

const defaultZoom = 11;
const defaultCenter = { lat: 52.520008, lng: 13.404954 };

// Prüfen, ob Gerät Geolocation unterstützt
const navigatorAvailable = Boolean(window?.navigator?.geolocation);



function LocationFinder({locations}: Props) {

  return (
    <div>
      {navigatorAvailable && 'hi'}    
      <Map zoom={defaultZoom} center={defaultCenter} locations={locations.stations} />
    </div>
  )
}





export default LocationFinder;
