import LocationFinder from "@/components/LocationFinder";

export const metadata = {
  title: 'Willkommen!',
};

export default function Home() {
  return (
    <main>
      <h1>Tankstellen Sucher</h1>
      <LocationFinder />
    </main>
  );
}
