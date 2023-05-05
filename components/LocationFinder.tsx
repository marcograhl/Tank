'use client'
import { Station } from "@/types/tankstellen-types";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getUserLocation, getDistance } from "@/lib/helpers";
import { LatLng } from "@/types/tankstellen-types";
import LocationList from "./LocationList";
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
});



type Props = {
  locations: {
    stations: Station[]
    }
}

const defaultZoom = 11;
const defaultCenter = { lat: 52.520008, lng: 13.404954 };




function LocationFinder({ locations }: Props) {
  const [showMap, setShowMap] = useState(false);
  const [zoom, setZoom] = useState(defaultZoom);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [geolocationError, setGeolocationError] = useState('');
  const [navigatorAvailable, setNavigatorAvailable] = useState(false);

// test if we are on the Client do it inside of the component
  useEffect(() => {
    setNavigatorAvailable(Boolean(window?.navigator?.geolocation));
  }, []);

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
  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
      setZoom(4);
    } else {
      reset();
    }
  }, [userLocation]);


  function reset() {
    setZoom(defaultZoom);
    setMapCenter(defaultCenter);
    setUserLocation(null);
    setGeolocationError('');
  }

  // const visibleLocations = userLocation
  //   ? getLocationsInRadius(userLocation)
  //   : locations.stations.map((location) => {
  //       location.distance = undefined;
  //       return location;
  //     });
  //
  const listTen = locations.stations.slice(0,10)




  return (
    <div>
      {navigatorAvailable && (
        <button onClick={showNearLocations}>This is my Location </button>
      )}
      {geolocationError && <strong>{geolocationError}</strong>}

      <button onClick={reset}>Alle Standorte anzeigen</button>
      {showMap ? (
        <Map zoom={zoom} center={mapCenter} stations={locations.stations} />
      ) : (
        <div>
          <button onClick={() => setShowMap(true)}>Karte anzeigen</button>
        </div>
      )
      }
      <LocationList stations={listTen} />
    </div>
  )
}


// function getLocationsInRadius(center: LatLng, radius = 10) {
//   /* Hier allLocations so filtern, dass nur Standorte innerhalb des Radius
//   (Entfernung von center) in einem neuen Array locationsInRadius bleiben.
//   Dabei soll jeder Eintrag in dem neuen Array zugleich die Distanz zum
//   center als Eigenschaft distance erhalten.
//   */
//   const locationsInRadius = locations.stations.filter((location) => {
//     const distance = getDistance(
//       location.latLng.lat,
//       location.latLng.lng,
//       center.lat,
//       center.lng
//     );
//
//     location.distance = distance;
//
//     return distance <= radius;
//   });
//   /* Den Array locationsInRadius nach Entfernung sortieren und anschließend
//   zurückgeben. */
//   locationsInRadius.sort((a, b) => a.distance! - b.distance!);
//
//   return locationsInRadius;
// }
//


export default LocationFinder;
