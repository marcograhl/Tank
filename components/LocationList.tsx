import { Station } from "@/types/tankstellen-types";
import type { Dispatch, SetStateAction } from 'react';


type Props = {
  stations: Station[];
  gasType: string;
  setMapCenter: Dispatch<SetStateAction<{
    lat: number;
    lng: number;
}>>
setZoom: Dispatch<SetStateAction<number>>;
};
export default function LocationList({ stations, gasType,setMapCenter,setZoom }: Props) {
// ()=>setMapCenter({lat:lat,lng:lng})
  function lockOnStation(lat:number,lng:number, zoom = 16){
     setMapCenter({lat:lat,lng:lng})
     setZoom(zoom)
    }
  return (
    <ul className="location-finder__list">
      {stations.map(({ name, street, postCode, e5, e10, diesel, distance, id, houseNumber,lat,lng }) => (
        <li key={id} data-id={id} >
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
        </li>
      ))}
    </ul>
  );
}

