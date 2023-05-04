import { locations } from "@/lib/tankstellen";
import dynamic from "next/dynamic";
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
});

// Berlin
const defaultCenter = { lat: 52.520008, lng: 13.404954 };
const defaultZoom = 11;


function LocationFinder() {
  return (
    <div>
      <Map zoom={defaultZoom} center={defaultCenter} locations={locations.stations} />
    </div>
  )
}


export default LocationFinder;
