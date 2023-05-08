'use client'
import { Gastype, Station,UserSettings } from "@/types/tankstellen-types";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getUserLocation, getDistance } from "@/lib/helpers";
import { LatLng } from "@/types/tankstellen-types";
import LocationList from "./LocationList";
import LocationSearch from "./LocationSearch";
import ListSelect from "./ListSelect";
import FuelSelect from "./FuelTypeSelect";
// import GasTypeSelector from "./GasTypeSelect";


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
const defaultGasType = 'e5' as Gastype;
const defaultListMaxNumber = 15
const defaultFavList = [] as Station[];
const defaultSettings = {
  fuelType: defaultGasType,
  favoriteStations: defaultFavList
} 





function LocationFinder({ locations }: Props) {
  const [showMap, setShowMap] = useState(false);
  const [zoom, setZoom] = useState(defaultZoom);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [geolocationError, setGeolocationError] = useState('');
  const [navigatorAvailable, setNavigatorAvailable] = useState(false);
  const [gasType, setGasType] = useState(defaultGasType)
  const [favoriteStations, setFavoriteStations] = useState(defaultFavList);
  const [userSettings, setUserSetting] = useState(defaultSettings)
  const [showFavList, setShowFavList] = useState(false);

  useEffect(() => {
    setNavigatorAvailable(Boolean(window?.navigator?.geolocation));

    const oldSettings = getInitialUserSetting();
    console.log(oldSettings)
    setGasType(oldSettings.fuelType)
    setFavoriteStations(oldSettings.favoriteStations)
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const newSettings = {
        fuelType: gasType,
        favoriteStations
      }
      setUserSetting(newSettings)
      localStorage.setItem('userSettings', JSON.stringify(newSettings))
    }
  }, [gasType,favoriteStations])


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
      setZoom(13);
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



  function comparePrice(a: Station, b: Station) {
    return a[gasType]! - b[gasType]!
  }

  const isOpenAndHasPrice = locations.stations.filter((station) => station[gasType]).filter((station) => station.isOpen).sort(comparePrice);
  const lowestPrice = isOpenAndHasPrice.slice(0, 1).map((item) => item[gasType]).toString()


  // if we have a userLocation, give back the location of Gasstations that are 5km away, if not return all locations
  const visibleLocations = userLocation
    ? getLocationsInRadius(userLocation, isOpenAndHasPrice)
    : isOpenAndHasPrice.map((location) => {
      location.distance = undefined;
      return location;
    })

  const priceSortStations: Station[] = visibleLocations.slice(0, defaultListMaxNumber);

  return (
    <div>
      <FuelSelect gasType={gasType} setGasType={setGasType} />
      {navigatorAvailable && (
        <button onClick={showNearLocations}>This is my Location </button>
      )}
      {geolocationError && <strong>{geolocationError}</strong>}

      <button onClick={reset}>Alle Standorte anzeigen</button>
      {visibleLocations.length === 0 && (
        <strong className="location-finder__error">
          Leider kein Standort in Ihrer Nähe.
        </strong>
      )}
      <LocationSearch setUserLocation={setUserLocation} />

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
      <p>Lowest Price</p>
      <dl>
        <div>
          <dt>{gasType}</dt>
          <dd>{lowestPrice}</dd>
        </div>
      </dl>
      <ListSelect setShowFavList={setShowFavList} />
      {!showFavList ?
        <LocationList
           favoriteStations={favoriteStations}
          stations={priceSortStations}
          gasType={gasType}
          setMapCenter={setMapCenter}
          setZoom={setZoom}
          userLocation={userLocation}
          setFavoriteStations={setFavoriteStations}
        /> :
        <LocationList
          favoriteStations={favoriteStations}
          stations={favoriteStations}
          gasType={gasType}
          setMapCenter={setMapCenter}
          setZoom={setZoom}
          userLocation={userLocation}
          setFavoriteStations={setFavoriteStations}
        />

      }




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
  zurückgeben. We don't need it yet maybe later */
  // locationsInRadius.sort((a, b) => a.distance! - b.distance!);
  // console.log(locationsInRadius)

  return locationsInRadius;
}

function getInitialUserSetting() {
  try {
    const oldUserSetting = JSON.parse(localStorage.getItem('userSettings') || '{}');
    return oldUserSetting ? oldUserSetting : {};
  } catch (error) {
    console.log(error);
    localStorage.removeItem('userSettings');
    return {};
  }
}


export default LocationFinder;
