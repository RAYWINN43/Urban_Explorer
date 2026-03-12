export interface Coordinates {
  lat: number;
  lon: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    results: T[];
}

export interface LocationMapProps {
    onLocationFound: (coords: Coordinates) => void;
}



export interface Lieu {
    id?: string;
    title: string | null;
    lat_lon: Coordinates;
    description: string | null;
    cover_url: string | null;
    addressName: string | null;
    addressStreet: string | null;
    addressZipcode: string | null;
    addressCity: string | null;
    price: number | null;
}