export type Hotel = {
  _id: string;
  chain_name: string;
  hotel_name: string;
  city: string;
  country: string;
};
export type HotelDetails = Hotel & {
  addressline1: string;
  addressline2: string;
  zipcode: string;
  state: string;
  countryisocode: string;
  star_rating: string;
};

export type City = { _id: string; name: string };
export type Country = { _id: string; name: string };

// API responses
export type AccommodationsResponse = {
  hotels: Hotel[];
  cities: City[];
  countries: Country[];
};

export type CityResponse = City & {
  hotels: HotelDetails[];
};

export type CountryResponse = Country & {
  hotels: HotelDetails[];
};
