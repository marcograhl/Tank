export type LatLng = {
  lat: number;
  lng: number;
};

export type Gastype= 'e10' | 'e5' | 'diesel'

export type ListType = 'Top 10' | 'Favorites'

export type Selection = {
  value: ListType | Gastype
}


export type UserSettings ={
  fuelType: Gastype;
  favoriteStations: Station[];
}

export type Station = {
  id: string;
  name: string;
  brand: string;
  street: string;
  place: string;
  lat: number;
  lng: number;
  dist: number;
  diesel?: number;
  e5?: number;
  e10?: number;
  isOpen: boolean;
  houseNumber: string;
  postCode: number;
  isFavorite?: boolean;
  distance?: number;
}

export type Suggestion = {
    country_code: string;
    zipcode: string;
    place: string;
    state: string;
    state_code: string;
    province: string;
    province_code: string;
    community: string;
    community_code: string;
    latitude: string;
    longitude: string;
}





