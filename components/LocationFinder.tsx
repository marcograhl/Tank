'use client'
import { Gastype, Station } from "@/types/tankstellen-types";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getUserLocation, getDistance } from "@/lib/helpers";
import { LatLng } from "@/types/tankstellen-types";
import LocationList from "./LocationList";
import GasTypeSelector from "./GasTypeSelect";

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
});



type Props = {
  locations: {
    stations: Station[]
  }
}

const defaultZoom = 10;
const defaultCenter = { lat: 52.520008, lng: 13.404954 };
const defaultGasType: Gastype = 'e5';
const defaultListMaxNumber = 15




function LocationFinder({ locations }: Props) {
  const [showMap, setShowMap] = useState(false);
  const [zoom, setZoom] = useState(defaultZoom);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [geolocationError, setGeolocationError] = useState('');
  const [navigatorAvailable, setNavigatorAvailable] = useState(false);
  const [gasType, setGasType] = useState(defaultGasType)

  // test if we are on the Client do it inside of the component
  useEffect(() => {
    setNavigatorAvailable(Boolean(window?.navigator?.geolocation));
  }, []);

  async function showNearLocations() {
    setGeolocationError('');
    try {
      const location = await getUserLocation();

      const userCenter: LatLng = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
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
  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
      setZoom(12);
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



  function comparePrice(a: any, b: any) {
    return a[gasType] - b[gasType]
  }

  const isOpenAndHasPrice = locations.stations.filter((station) => station[gasType]).filter((station) => station.isOpen)
  // const lowestPrice :Station = priceSortArr.slice(0,1);


  // if we have a userLocation, give back the location of Gasstations that are 5km away, if not return all locations
  const visibleLocations = userLocation
    ? getLocationsInRadius(userLocation, isOpenAndHasPrice)
    : isOpenAndHasPrice.map((location) => {
      location.distance = undefined;
      return location;
    })

  const priceSortStations: Station[] = visibleLocations.sort(comparePrice).slice(0, defaultListMaxNumber);

  return (
    <div>
      {navigatorAvailable && (
        <button onClick={showNearLocations}>This is my Location </button>
      )}
      {geolocationError && <strong>{geolocationError}</strong>}

      <button onClick={reset}>Alle Standorte anzeigen</button>
      <GasTypeSelector setGasType={setGasType} gasType={gasType} />
      {showMap ? (
        <Map
          zoom={zoom}
          center={mapCenter}
          stations={visibleLocations} />
      ) : (
        <div>
          <button onClick={() => setShowMap(true)}>Karte anzeigen</button>
        </div>
      )
      }
      <LocationList
        stations={priceSortStations}
        gasType={gasType}
        setMapCenter={setMapCenter}
        setZoom={setZoom}
        userLocation={userLocation}
        />
    </div>
  )
}


function getLocationsInRadius(center: LatLng, locations: Station[], radius = 6) {
  /* Hier allLocations so filtern, dass nur Standorte innerhalb des Radius
  (Entfernung von center) in einem neuen Array locationsInRadius bleiben.
  Dabei soll jeder Eintrag in dem neuen Array zugleich die Distanz zum
  center als Eigenschaft distance erhalten.
  */
  const locationsInRadius = locations.filter((location) => {
    const distance = getDistance(
      location.lat,
      location.lng,
      center.lat,
      center.lng
    );

    location.distance = distance;

    return distance <= radius;
  });
  /* Den Array locationsInRadius nach Entfernung sortieren und anschließend
  zurückgeben. */
  locationsInRadius.sort((a, b) => a.distance! - b.distance!);
  console.log(locationsInRadius)

  return locationsInRadius;
}



export default LocationFinder;
