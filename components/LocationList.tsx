import { Station, LatLng } from "@/types/tankstellen-types";
import Link from "next/link";
import type { Dispatch, SetStateAction } from 'react';
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
};
export default function LocationList({ stations, gasType,setMapCenter,setZoom,userLocation }: Props) {
  function lockOnStation(lat:number,lng:number, zoom = 15){
     setMapCenter({lat:lat,lng:lng})
     setZoom(zoom)
    }
  return (
    <ul className="location-finder__list">

      {stations.length === 0 ? <span>You don't have any Favorties yet</span> : stations.map(({ name, street, postCode, e5, e10, diesel, distance, id, houseNumber,lat,lng }) => (
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
          <button onClick={()=>lockOnStation(lat,lng)}>Center Position</button>
          {userLocation &&(
              <Link href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${lat},${lng}`} target="_blank" rel="noreferrer">
              Get Directions
              <FaExternalLinkAlt />
              </Link>
          ) }
        </li>
      ))}
    </ul>
  );
}

