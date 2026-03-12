export interface Coordinates {
  lat: number;
  lon: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface LocationMapProps {
    onLocationFound: (coords: Coordinates) => void;
}



export interface Lieu {
    id?: string;
    title: string | null;
    lat_lon: Coordinates | null;
    description: string | null;
    cover_url: string | null;
    address_name: string | null;
    address_street: string | null;
    address_zipcode: string | null;
    address_city: string | null;
    price_detail: number | null;
}