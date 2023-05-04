import { locations } from "@/lib/tankstellen";
import dynamic from "next/dynamic";
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
});

// fetch data every 15min
export const revalidate = 900;

// Berlin
const defaultCenter = { lat: 52.520008, lng: 13.404954 };
const defaultZoom = 11;
const defaultRadius = 15;

// enviroment Variables
const TANK_URL = process.env.TANK_URL
const TANK_KEY = process.env.TANK_KEY

// Fetch data from tankerkoenig
const getLocations = async() => {
  const response = await fetch(`${TANK_URL}list.php?lat=${defaultCenter.lat}&lng=${defaultCenter.lng}&rad=${defaultRadius}&sort=dist&type=all&apikey=${TANK_KEY}`)
  return response.json();
}

async function LocationFinder() {
  const locations = await getLocations();
  return (
    <div>
      <Map zoom={defaultZoom} center={defaultCenter} locations={locations.stations} />
    </div>
  )
}


export function getUserLocation(): Promise<GeolocationPosition> {
  // https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
  const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  /* Die ältere geolocation-API basiert auf Callback-Funktionen statt
      Promises. Hier wird sie in ein Promise verpackt, um sie in asynchronen
      Funktionen nutzen zu können. */
  return new Promise((resolve, reject) => {
    window.navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}


export default LocationFinder;
