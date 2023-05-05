import { Station } from "@/types/tankstellen-types";

type Props = {
  stations: Station[]
};
export default function LocationList({ stations }: Props) {
  return (
    <ul className="location-finder__list">
      {stations.map(({ name, street, postCode, e5, e10, diesel, distance, id, houseNumber }) => (
        <li key={id}>
          <dl>
            <div>
              <dt>Name:</dt>
              <dd>{name}</dd>
            </div>

            <div>
              <dt>Adresse:</dt>
              <dd>{street} {houseNumber} , {postCode}</dd>
            </div>

            <div>
              <dt>Super E10</dt>
              <dd>{e10}</dd>
            </div>

            <div>
              <dt>Super E5</dt>
              <dd>{e5}</dd>
            </div>

            <div>
            <dt>Diesel</dt>
            <dd>{diesel}</dd>
            </div>

          </dl>
        </li>
      ))}
    </ul>
  );
}

