import LocationFinder from "@/components/LocationFinder";

export const metadata = {
  title: 'Find the cheapest price for your fuel',
};


// fetch data every 15min, 
export const revalidate = 900;

// Berlin
const defaultRadius = 18;
const defaultCenter = { lat: 52.520008, lng: 13.404954 };


// enviroment Variables
const TANK_URL = process.env.TANK_URL
const TANK_KEY = process.env.TANK_KEY

// Fetch data from tankerkoenig
const getLocations = async () => {
  const response = await fetch(`${TANK_URL}list.php?lat=${defaultCenter.lat}&lng=${defaultCenter.lng}&rad=${defaultRadius}&sort=dist&type=all&apikey=${TANK_KEY}`)
  return response.json();
}
export default async function Home() {
  const locations = await getLocations();
  

  return (
    <main className="wrapper">
      <h1>Top 10: Berlin Gasstation Prices </h1>
      <LocationFinder locations={locations} />
    </main>
  );
}
