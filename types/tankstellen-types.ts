export type Base = {
  status: string;
  e5: number;
  e10: number;
  diesel: number;
}

export type LatLng = {
  lat: number;
  lng: number;
};

export type Location = {
  dist: number;
  latLng: LatLng;

}



export type TankstellenListe = Base & LatLng & {
  id: string;
  name: string;
  brand: string;
  street: string;
  place: string;
  diesel: number;
  e5: number;
  e10: number;
  isOpen: boolean;
  houseNumber: string;
  postCode: number;
}
