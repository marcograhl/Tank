import { Station, LatLng } from "@/types/tankstellen-types";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';


type Props = {
  stations: Station[];
  gasType: string;
  setMapCenter: Dispatch<SetStateAction<{
    lat: number;
    lng: number;
  }>>
  setZoom: Dispatch<SetStateAction<number>>;
  userLocation: LatLng | null;
  setFavoriteStations: Dispatch<SetStateAction<Station[]>>
  favoriteStations: Station[];
};
export default function LocationList({ stations, gasType, setMapCenter, setZoom, userLocation, setFavoriteStations, favoriteStations }: Props) {

  function toggleFavorite(id: string) {

    const currentFavorite = stations.filter(station => station.id === id)
    const notInFavorite = !favoriteStations.some(station => station.id === id)
    const isFavorite = !notInFavorite


    if (notInFavorite) {
      const newFavoriteStations = [...currentFavorite, ...favoriteStations]
      setFavoriteStations(newFavoriteStations)
    } else if (isFavorite) {
      const newFavoriteStations = favoriteStations.filter(station=> station.id !== id)
      setFavoriteStations(newFavoriteStations)
    }
    console.log(favoriteStations)
  }

  function lockOnStation(lat: number, lng: number, zoom = 15) {
    setMapCenter({ lat, lng })
    setZoom(zoom)
  }
  return (
    <ul className="location-finder__list">

      {stations.length === 0 ? <span>You dont have any Favorties yet</span> : stations.map(({ name, street, postCode, e5, e10, diesel, distance, id, houseNumber, lat, lng }) => (
        <li key={id}>
          <dl>
            <div>
              <dt>Name:</dt>
              <dd>{name}</dd>
            </div>
            {distance !== undefined &&
              <div>
                <dt>Distance:</dt>
                <dd>{distance.toFixed(2)} km</dd>
              </div>
            }

            <div>
              <dt>Adresse:</dt>
              <dd>{street} {houseNumber} , {postCode}</dd>
            </div>
            {(gasType === "e10") && (
              <div>
                <dt>Super E10</dt>
                <dd>{e10}</dd>
              </div>
            )}
            {(gasType === "e5") && (
              <div>
                <dt>Super E5</dt>
                <dd>{e5}</dd>
              </div>
            )}

            {(gasType === "diesel") && (
              <div>
                <dt>Diesel</dt>
                <dd>{diesel}</dd>
              </div>
            )}
          </dl>
          <button onClick={() => toggleFavorite(id)}>♥️ </button>
          <button onClick={() => lockOnStation(lat, lng)}>Center Position</button>
            <Link href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${lat},${lng}`} target="_blank" rel="noreferrer">
              Get Directions
              <FaExternalLinkAlt />
            </Link>
        </li>
      ))}
    </ul>
  );
}

