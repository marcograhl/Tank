import Map from "@/components/Map/Map";

export const metadata = {
  title: 'Willkommen!',
};

const data = {
  stations: [
    {
      name: "TOTAL BERLIN",
      lat: 52.53083,
      lng: 13.440946,
    }
  ]
}


// Berlin
const defaultCenter = { lat: 52.520008, lng: 13.404954 };
const defaultZoom = 11;



export default function Home() {
  return (
    <main>
      <h1>Tankstellen Sucher</h1>
      <Map zoom={defaultZoom} center={defaultCenter} locations={data.stations} />
    </main>
  );
}
