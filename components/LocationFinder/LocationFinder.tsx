import Map from "../Map";


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


function LocationFinder() {
  return (
    <div>
      <Map zoom={defaultZoom} center={defaultCenter} locations={data.stations} />
    </div>
  )
}


export default LocationFinder;
