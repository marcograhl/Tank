'use client'
import { Station } from "@/types/tankstellen-types";
import dynamic from "next/dynamic";
import { useState } from "react";
import { getUserLocation } from "@/lib/helpers";
import { LatLng } from "@/types/tankstellen-types";
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
});



type Props = {
  locations: {
    stations: Station[]
    }
}
let navigatorAvailable = false;
const defaultZoom = 11;
const defaultCenter = { lat: 52.520008, lng: 13.404954 };

// test if we are on the Client
// Finder is now Client only Component because of dynamic import, maybe later change that
// we Get hydration problem
if(typeof window !== "undefined"){
  navigatorAvailable = Boolean(window?.navigator?.geolocation);
}



function LocationFinder({ locations }: Props) {
  const [showMap, setShowMap] = useState(false);
  const [zoom, setZoom] = useState(defaultZoom);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [geolocationError, setGeolocationError] = useState('');

  async function showNearLocations() {
    setGeolocationError('');
    try {
      const location = await getUserLocation();
      console.log(location);

      const userCenter: LatLng = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
      setMapCenter(userCenter);
      setZoom(11);
      setUserLocation(userCenter);
    } catch (error) {
      console.log(error);
      // https://developer.mozilla.org/en-US/docs/Web/API/PositionError
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeolocationError(
              'Sie müssen die Erlaubnis zur Standortermittlung erteilen.'
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setGeolocationError(
              'Ihr Standort konnte aus technischen Gründen nicht ermittelt werden.'
            );
            break;
          case error.TIMEOUT:
            setGeolocationError(
              'Die Standortermittlung hat zu lange gedauert.'
            );
            break;
        }
      }
    }
  }
  function reset() {
    setZoom(defaultZoom);
    setMapCenter(defaultCenter);
    setUserLocation(null);
  }




  return (
    <div>
      {navigatorAvailable && (
        <button onClick={showNearLocations}>This is my Location </button>
      )}
      {geolocationError && <strong>{geolocationError}</strong>}

      <button onClick={reset}>Alle Standorte anzeigen</button>
      {showMap ? (
        <Map zoom={zoom} center={mapCenter} locations={locations.stations} />
      ) : (
        <div>
          <button onClick={() => setShowMap(true)}>Karte anzeigen</button>
        </div>
      )
      }
    </div>
  )
}





export default LocationFinder;
